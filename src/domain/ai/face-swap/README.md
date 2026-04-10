# Face Swap — AI Hoán Đổi Khuôn Mặt

Endpoint hoán đổi khuôn mặt bằng AI sử dụng [Facemint.io Face Swap API](https://facemint.io/face-swap-api).

Ảnh `target_face` (target) được giữ nguyên nội dung/bối cảnh, chỉ khuôn mặt trong ảnh đó được thay thế bằng khuôn mặt từ ảnh `image` (user).

> **Hướng swap:** ảnh user chứa khuôn mặt sẽ được **ghép vào** ảnh target. Output là ảnh target nhưng có khuôn mặt của user.

---

## Luồng hoạt động

```
Client gửi ảnh user (image) + target_face URL [+ ref_face URL nếu cần]
  │
  ├─ 1. Server nhận ảnh user qua multipart/form-data
  │
  ├─ 2. Nén ảnh user (~200KB) rồi upload lên Cloud Storage
  │     → nguyen_van_a-original.jpg  (ảnh chứa khuôn mặt user)
  │
  ├─ 3. Gọi Facemint.io createTask
  │     - media_url  = target_face URL (ảnh gốc giữ nội dung)
  │     - to_face    = URL ảnh user vừa upload (khuôn mặt mới ghép vào)
  │     - from_face  = ref_face URL (optional — crop mặt target cần thay)
  │                    Nếu omit, Facemint sẽ thay TẤT CẢ mặt trong target.
  │
  ├─ 4. Poll /get-task-info mỗi 3s cho đến khi state = 3 (timeout: 2 phút)
  │
  ├─ 5. Download ảnh kết quả → nén (~500KB) → upload Cloud Storage
  │     → nguyen_van_a-generated.jpg  (ảnh target với mặt user)
  │
  └─ 6. Trả về response với originalUrl + generatedUrl
        (target_face và ref_face KHÔNG được lưu trên server)
```

---

## Endpoint

### `POST /api/ai/face-swap/generate`

**Content-Type:** `multipart/form-data`

### Request fields

| Field         | Type   | Required | Mô tả |
| ------------- | ------ | -------- | ----- |
| `image`       | File   | Yes      | Ảnh user (jpeg, png, webp — max 10MB) chứa khuôn mặt sẽ được ghép vào target. |
| `name`        | string | Yes      | Tên cơ sở cho file (VD: `nguyen_van_a`). |
| `target_face` | string | Yes      | URL public ảnh target — ảnh gốc giữ nguyên nội dung, chỉ khuôn mặt trong đó bị thay bằng mặt user. |
| `ref_face`    | string | No       | URL public ảnh **crop khuôn mặt cần thay trong target**. Dùng khi target có **nhiều người** để chỉ định chính xác mặt nào cần thay. Nếu omit, Facemint sẽ thay TẤT CẢ mặt trong target. |
| `resolution`  | number | No       | Độ phân giải: `1`=480p, `2`=720p, `3`=1080p, `4`=2K, `5`=4K, `6`=8K (default: `3`). |
| `enhance`     | number | No       | Bật enhance khuôn mặt: `1`=on, `0`=off (default: `1`). |

> ⚠️ `target_face` và `ref_face` **phải là URL public** — Facemint server phải tải được ảnh. URL localhost / private network sẽ không hoạt động.

### Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Face swap thành công",
  "data": {
    "originalUrl": "https://s3-north1.viettelidc.com.vn/.../nguyen_van_a-original.jpg",
    "generatedUrl": "https://s3-north1.viettelidc.com.vn/.../nguyen_van_a-generated.jpg",
    "baseName": "nguyen_van_a"
  }
}
```

### Errors

| Status | Khi nào                                                               |
| ------ | --------------------------------------------------------------------- |
| 400    | Thiếu file ảnh, thiếu `name` hoặc `target_face`                       |
| 500    | `FACEMINT_API_KEY` chưa cấu hình, Facemint API lỗi, task failed/timeout |

> `ref_face` là **optional**, không validate. Nếu không gửi → Facemint thay tất cả mặt trong target.

---

## Quy tắc đặt tên file

Cả 2 ảnh dùng **cùng tên cơ sở** (`name` đã được chuẩn hoá), chỉ khác hậu tố:

```
{safeName}-original.jpg    ← ảnh user gốc (chứa khuôn mặt user, đã nén)
{safeName}-generated.jpg   ← ảnh target sau khi swap khuôn mặt user vào
```

**Ví dụ:** `name = "Nguyễn Văn A"`

- Ảnh gốc: `nguyen_van_a-original.jpg`
- Ảnh AI: `nguyen_van_a-generated.jpg`

> Dấu tiếng Việt được loại bỏ, khoảng trắng chuyển thành `_`, ký tự đặc biệt bị bỏ.

---

## Cấu hình

Thêm vào file `.env`:

```env
FACEMINT_API_KEY=your_facemint_api_key_here

# (Optional) Callback URL — Facemint yêu cầu field này phải là URL hợp lệ.
# Server không dùng callback mà poll kết quả, nhưng vẫn phải gửi placeholder.
FACEMINT_CALLBACK_URL=https://example.com/facemint/callback
```

---

## Chú ý khi gọi API

1. **`target_face` và `ref_face` phải là URL public**
   - Facemint server cần tải được ảnh. URL từ `localhost`, `127.0.0.1`, IP nội bộ sẽ fail.
   - Nên dùng URL từ CDN / cloud storage / public image host.

2. **Ảnh phải chứa khuôn mặt rõ nét**
   - Cả `image` (ảnh user) lẫn `target_face` đều cần có khuôn mặt phát hiện được.
   - Nếu không detect được face, Facemint sẽ trả về lỗi.

3. **Khi nào cần dùng `ref_face`**
   - Target chỉ có 1 người → **không cần** `ref_face`. Facemint tự thay mặt duy nhất đó.
   - Target có nhiều người → **nên gửi** `ref_face` (URL ảnh crop riêng khuôn mặt cần thay) để tránh việc Facemint thay nhầm hoặc thay tất cả mặt.
   - `ref_face` chỉ cần là khuôn mặt giống mặt cần thay trong target — Facemint sẽ match dựa trên khuôn mặt này.

4. **Thời gian chờ: 10–120 giây**
   - Server poll task mỗi 3s, timeout tổng là 2 phút.
   - Client nên set timeout ≥ 150 giây.

5. **`target_face` và `ref_face` KHÔNG được lưu**
   - Server chỉ lưu ảnh gốc của user (`-original.jpg`) và ảnh kết quả (`-generated.jpg`).
   - Client tự chịu trách nhiệm quản lý `target_face` và `ref_face`.

6. **Kích thước file upload**
   - Giới hạn multer ~20MB. Ảnh quá lớn nên resize trước khi upload.

7. **Tên file sẽ bị ghi đè**
   - `baseName` hiện không có timestamp, nên gọi endpoint với cùng `name` sẽ ghi đè file cũ trên Cloud Storage.
   - Nếu cần giữ lịch sử, client tự thêm suffix (VD: `name = "user_${timestamp}"`).

---

## Cấu trúc source code

```
src/domain/ai/face-swap/
├── README.md          ← File này
├── route.ts           ← Khai báo route POST /generate
└── controller.ts      ← Logic: validate → upload gốc → gọi AI → upload AI → response

src/services/ai/
└── faceSwap.service.ts  ← Gọi Facemint.io API (createTask + pollTaskResult)
```

---

## Test với cURL

```bash
curl -X POST http://localhost:9456/api/ai/face-swap/generate \
  -F "image=@/path/to/user_photo.jpg" \
  -F "name=nguyen_van_a" \
  -F "target_face=https://example.com/target_face.jpg" \
  -F "resolution=3" \
  -F "enhance=1"
```

---

## Test với Postman

1. **Method:** `POST`
2. **URL:** `http://localhost:9456/api/ai/face-swap/generate`
3. **Tab Body** → chọn **form-data**
4. Thêm các fields:

   | Key           | Type | Value                                       |
   | ------------- | ---- | ------------------------------------------- |
   | `image`       | File | Chọn ảnh user từ máy                        |
   | `name`        | Text | `nguyen_van_a`                              |
   | `target_face` | Text | `https://example.com/target_face.jpg`       |
   | `resolution`  | Text | `3` *(optional)*                            |
   | `enhance`     | Text | `1` *(optional)*                            |

5. **Tab Headers** (Postman tự set `Content-Type: multipart/form-data` khi chọn form-data, **không cần thêm thủ công**).
6. **Settings → Request timeout in ms**: đặt ≥ `150000` (2.5 phút) để tránh bị Postman cancel sớm.
7. **Send**.

> Response có thể mất **10–120 giây** do phải chờ Facemint xử lý task.

### Ví dụ response thành công

```json
{
  "statusCode": 200,
  "message": "Face swap thành công",
  "data": {
    "originalUrl": "https://s3-north1.viettelidc.com.vn/bucket/20260410-nguyen_van_a-original.jpg",
    "generatedUrl": "https://s3-north1.viettelidc.com.vn/bucket/20260410-nguyen_van_a-generated.jpg",
    "baseName": "nguyen_van_a"
  }
}
```

### Ví dụ response lỗi

```json
{
  "statusCode": 400,
  "message": "Thiếu \"name\" hoặc \"target_face\" trong body."
}
```

---

## Troubleshooting

| Lỗi                                                   | Nguyên nhân / Cách xử lý                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Facemint createTask failed: Invalid callback url`    | Set biến env `FACEMINT_CALLBACK_URL` thành URL hợp lệ (có `https://`)           |
| `Facemint createTask HTTP 401/403`                    | `FACEMINT_API_KEY` sai hoặc hết hạn — kiểm tra lại trên facemint.io dashboard    |
| `Facemint task thất bại (state=-1)`                   | Ảnh không detect được khuôn mặt, hoặc `target_face` URL không tải được          |
| `Facemint task timeout sau 120s`                      | Facemint bị quá tải — thử lại, hoặc tăng `POLL_TIMEOUT` trong `faceSwap.service.ts` |
| `Thiếu file ảnh`                                      | Field `image` trong form-data chưa đúng tên hoặc chưa chọn file                 |
| Request hang ở Postman                                | Tăng **Request timeout** trong Settings lên ≥ 150000ms                          |
