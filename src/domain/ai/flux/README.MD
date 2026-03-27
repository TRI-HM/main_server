# Flux (PiAPI) — Kontext image-to-image

Module này nhận **ảnh + prompt** từ client, upload ảnh lên storage (cloud hoặc local), gọi [PiAPI Flux Kontext](https://piapi.ai/docs/flux-api/kontext) để chỉnh/sinh ảnh, rồi lưu ảnh kết quả và trả URL cho client.

---

## 1. Cấu hình server (`.env`)

### Bắt buộc cho bước tạo ảnh (PiAPI)

| Biến | Mô tả |
|------|--------|
| `PIAPI_API_KEY` hoặc `PIAPI_KEY` | API key PiAPI (header `X-API-Key` khi gọi `https://api.piapi.ai`). |

### Lưu trữ ảnh (upload ảnh gốc + ảnh sau Flux)

**Cách A — Cloud (khuyến nghị production)**  

| Biến | Mô tả |
|------|--------|
| `CLOUD_STORAGE_UPLOAD_URL` | URL endpoint nhận `POST` multipart, trả JSON có `url` / `data.url` / `fileUrl`. |
| `CLOUD_STORAGE_FILE_FIELD` | (Tuỳ chọn) Tên field file, mặc định `file`. |
| `CLOUD_STORAGE_AUTH_HEADER` | (Tuỳ chọn) Ví dụ `Bearer <token>` gửi header `Authorization`. |

**Cách B — Lưu local (dev / khi chưa có cloud)**  

| Biến | Mô tả |
|------|--------|
| `BASE_URL` | Base URL public của server (ví dụ `http://localhost:3000`), **không** có dấu `/` cuối. Ảnh được ghi vào `public/images/uploads/` và URL trả về dạng `{BASE_URL}/images/uploads/...`. |

> PiAPI cần ảnh đầu vào là **URL hoặc base64** công khai; server upload buffer lên storage rồi truyền URL đó vào PiAPI.

---

## 2. Endpoint

Base path ứng dụng: `app.use('/api', routes)` → prefix **`/api`**.

| Method | Đường dẫn | Mô tả |
|--------|-----------|--------|
| `POST` | `/api/ai/flux/kontext-to-image` | Ảnh + prompt → ảnh mới (Kontext). |
| `GET` | `/api/ai/flux/text-to-image` | Endpoint test (hiện chỉ trả JSON OK); **yêu cầu JWT** theo `validateJWTMiddleware`. |

---

## 3. Hướng dẫn phía client (quan trọng)

### `POST /api/ai/flux/kontext-to-image`

- **Content-Type:** `multipart/form-data` (bắt buộc cho upload file).
- **Không** gửi JSON thuần cho phần body nếu muốn kèm file; dùng `FormData` (browser) hoặc tương đương (mobile).

**Các field:**

| Field | Bắt buộc | Kiểu | Ghi chú |
|--------|----------|------|--------|
| `image` | Có | File | Ảnh đầu vào. Chỉ nhận MIME bắt đầu bằng `image/`. |
| `prompt` | Có | Text | Hướng dẫn chỉnh/sinh ảnh (tiếng Anh thường cho kết quả ổn định hơn). |
| `width` | Không | Số | Ví dụ `1024`. |
| `height` | Không | Số | Ví dụ `1024`. |
| `steps` | Không | Số | Bước sinh (mặc định server 28, tối đa PiAPI 40). |

**Header (theo code hiện tại):** route `kontext-to-image` **không** gắn `validateJWTMiddleware` hay `validateAPIKeyMiddleware`. Nếu sau này bạn thêm middleware, client cần gửi thêm:

- `Authorization: Bearer <JWT>` (nếu bật JWT),
- `x-api-key: <key>` (nếu bật và trùng `FLUX_API_KEY` trên server).

**Ví dụ `curl`:**

```bash
curl -X POST "http://localhost:3000/api/ai/flux/kontext-to-image" \
  -F "image=@/path/to/photo.png" \
  -F "prompt=Change the background to a beach at sunset" \
  -F "width=1024" \
  -F "height=1024"
```

**Ví dụ JavaScript (browser):**

```javascript
const form = new FormData();
form.append("image", fileInput.files[0]); // file từ <input type="file">
form.append("prompt", "Your edit instruction here");
form.append("width", "1024");
form.append("height", "1024");

const res = await fetch("/api/ai/flux/kontext-to-image", {
  method: "POST",
  body: form,
  // credentials: "include" // nếu sau này dùng cookie/session
});
const json = await res.json();
```

### Response thành công (cấu trúc `ioCustom`)

`data` thường gồm:

- `sourceImageUrl` — URL ảnh gốc sau khi upload lên storage.
- `fluxOutputUrl` — URL ảnh tạm từ PiAPI (trước bước lưu lại lần hai).
- `generatedImageUrl` — URL ảnh cuối sau khi server lưu lại storage; **nên dùng URL này** cho hiển thị/lưu lâu dài phía client.

### Lưu ý cho client

1. **Giới hạn dung lượng:** multer memory giới hạn ~15MB; ảnh quá lớn sẽ bị từ chối.
2. **Thời gian chờ:** PiAPI có thể xử lý vài chục giây; client nên **timeout** đủ lớn (ví dụ 60–120s), không coi là lỗi mạng quá sớm.
3. **CORS:** nếu gọi từ domain khác server, cần cấu hình CORS trên Express cho origin của bạn.
4. **HTTPS production:** `BASE_URL` / URL cloud phải là **HTTPS** và ảnh phải **truy cập được công khai** từ internet (PiAPI tải ảnh qua URL).

---

## 4. Liên kết tham khảo

- [PiAPI — Flux Kontext](https://piapi.ai/docs/flux-api/kontext)
- [PiAPI — Unified API (create / get task)](https://piapi.ai/docs/unified-api-schema)
