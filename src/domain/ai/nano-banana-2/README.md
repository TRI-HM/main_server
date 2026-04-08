# NanoBanana2 — AI Image Generation

Endpoint tạo ảnh bằng AI sử dụng model [Google NanoBanana2](https://docs.kie.ai/market/google/nanobanana2) thông qua Kie.ai API.

---

## Luồng hoạt động

```
Client gửi ảnh + prompt
  │
  ├─ 1. Server nhận ảnh qua multipart/form-data
  │
  ├─ 2. Upload ảnh gốc lên Cloud Storage
  │     → nguyen_van_a-20260401143025123-original.jpg
  │
  ├─ 3. Gọi Kie.ai API createTask (gửi URL ảnh gốc + prompt)
  │
  ├─ 4. Poll getTaskDetails mỗi 3s cho đến khi AI tạo xong (timeout: 2 phút)
  │
  ├─ 5. Download ảnh AI → upload lên Cloud Storage
  │     → nguyen_van_a-20260401143025123-generated.jpg
  │
  └─ 6. Trả về response với 2 URL
```

---

## Endpoint

### `POST /api/ai/nano-banana-2/generate`

**Content-Type:** `multipart/form-data`

### Request fields

| Field           | Type   | Required | Mô tả                                                      |
| --------------- | ------ | -------- | ----------------------------------------------------------- |
| `image`         | File   | Yes      | Ảnh gốc (jpeg, png, webp — max 10MB)                       |
| `name`          | string | Yes      | Tên cơ sở cho file (VD: `nguyen_van_a`)                     |
| `prompt`        | string | Yes      | Mô tả yêu cầu ảnh AI cần tạo                               |
| `aspect_ratio`  | string | No       | Tỷ lệ ảnh: `1:1`, `3:2`, `16:9`, `auto`... (default: `auto`) |
| `resolution`    | string | No       | Độ phân giải: `1K`, `2K`, `4K` (default: `1K`)              |
| `output_format` | string | No       | Định dạng output: `png`, `jpg` (default: `jpg`)             |

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Tạo ảnh AI thành công",
  "data": {
    "originalUrl": "https://s3-north1.viettelidc.com.vn/.../nguyen_van_a-20260401143025123-original.jpg",
    "generatedUrl": "https://s3-north1.viettelidc.com.vn/.../nguyen_van_a-20260401143025123-generated.jpg",
    "baseName": "nguyen_van_a-20260401143025123"
  }
}
```

### Errors

| Status | Khi nào                                         |
| ------ | ----------------------------------------------- |
| 400    | Thiếu file ảnh, thiếu `name` hoặc `prompt`     |
| 500    | `KIE_API_KEY` chưa cấu hình, Kie.ai API lỗi   |

---

## Quy tắc đặt tên file

Cả 2 ảnh dùng **cùng tên cơ sở**, chỉ khác hậu tố:

```
{name}-{yyyyMMddHHmmssSSS}-original.{ext}    ← ảnh gốc
{name}-{yyyyMMddHHmmssSSS}-generated.{ext}   ← ảnh AI tạo ra
```

**Ví dụ:** `name = "nguyen van a"` → timestamp `20260401143025123`

- Ảnh gốc: `nguyen_van_a-20260401143025123-original.jpg`
- Ảnh AI: `nguyen_van_a-20260401143025123-generated.jpg`

> Khoảng trắng được chuyển thành `_`, ký tự đặc biệt bị loại bỏ.

---

## Cấu hình

Thêm vào file `.env`:

```env
KIE_API_KEY=your_kie_api_key_here
```

---

## Cấu trúc source code

```
src/domain/ai/nano-banana-2/
├── README.md          ← File này
├── route.ts           ← Khai báo route POST /generate
└── controller.ts      ← Logic: validate → upload gốc → gọi AI → upload AI → response

src/services/ai/
└── nanoBanana2.service.ts  ← Gọi Kie.ai API (createTask + pollTaskResult)
```

---

## Test với cURL

```bash
curl -X POST http://localhost:9456/api/ai/nano-banana-2/generate \
  -F "image=@/path/to/photo.jpg" \
  -F "name=nguyen_van_a" \
  -F "prompt=Turn this photo into a watercolor painting" \
  -F "resolution=1K" \
  -F "output_format=jpg"
```

## Test với Postman

1. Method: `POST`
2. URL: `http://localhost:9456/api/ai/nano-banana-2/generate`
3. Tab **Body** → chọn **form-data**
4. Thêm các fields:
   - `image` — type **File**, chọn ảnh từ máy
   - `name` — type Text, nhập VD: `nguyen_van_a`
   - `prompt` — type Text, nhập mô tả ảnh
   - `resolution` — type Text (optional)
   - `output_format` — type Text (optional)
5. Send

> Lưu ý: response có thể mất 10-60 giây do chờ AI xử lý.
