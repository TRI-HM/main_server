# Storage - Upload ảnh lên Cloud ViettelIDC

## Biến môi trường (.env)

```env
# Cloud Storage ViettelIDC (S3-compatible)
ENDPOINT_CLOUD_STORAGE=https://s3-north1.viettelidc.com.vn
SECRET_NAME=<access_key_id>
SECRET_KEY=<secret_access_key>
BUCKET_NAME=main-server

# Fallback khi không cấu hình cloud
BASE_URL=http://171.244.201.165:9456
```

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `ENDPOINT_CLOUD_STORAGE` | Không | S3 endpoint của ViettelIDC. Nếu để trống, ảnh sẽ lưu local. |
| `SECRET_NAME` | Có (nếu dùng cloud) | Access Key ID từ ViettelIDC. |
| `SECRET_KEY` | Có (nếu dùng cloud) | Secret Access Key từ ViettelIDC. |
| `BUCKET_NAME` | Không | Tên bucket. Mặc định: `main-server`. |
| `BASE_URL` | Có (nếu lưu local) | URL gốc của server, dùng để tạo link ảnh khi lưu local. |

## API Endpoints

### Upload ảnh

```
POST /api/storage/upload
```

**Content-Type:** `multipart/form-data`

**Body (form-data):**

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `image` | File | Có | File ảnh (jpeg, png, gif, webp, ...) |

**Giới hạn:** tối đa ~20MB

---

## Hướng dẫn test với Postman

1. Tạo request mới, chọn method **POST**
2. URL: `http://<host>:<port>/api/storage/upload`
3. Tab **Body** → chọn **form-data**
4. Thêm row:
   - Key: `image` → bấm dropdown bên phải chọn **File**
   - Value: chọn file ảnh từ máy
5. Bấm **Send**

### Response thành công (200)

```json
{
  "statusCode": 200,
  "message": "Upload thành công",
  "data": {
    "url": "https://s3-north1.viettelidc.com.vn/main-server/uploads/20260331-143021-582-anh_test.jpg"
  }
}
```

### Response lỗi - thiếu file (400)

```json
{
  "statusCode": 400,
  "message": "Thiếu file ảnh. Gửi multipart field tên `image`."
}
```

### Response lỗi - sai định dạng (500)

Nếu gửi file không phải ảnh (pdf, doc, ...), multer sẽ reject với lỗi:
```
Chỉ chấp nhận file ảnh
```

---

## Cách hoạt động

```
Client (Postman)
  │
  │  POST multipart/form-data  field: image
  ▼
Route: /api/storage/upload
  │
  │  multer memoryStorage → file.buffer
  ▼
Controller: uploadToCloud
  │
  │  gọi uploadImageBufferToPublicUrl(buffer, filename, mimetype)
  ▼
Service: cloudStorage.service.ts
  │
  ├─ Có ENDPOINT_CLOUD_STORAGE?
  │   ├─ Có  → S3 PutObject lên ViettelIDC → trả URL cloud
  │   └─ Không → Lưu vào public/images/uploads/ → trả URL local
  ▼
Response: { url: "..." }
```

## Cấu trúc file

```
src/
├── domain/storage/
│   ├── route.ts          # Định nghĩa route POST /upload
│   └── controller.ts     # Xử lý request, gọi service
├── services/storage/
│   └── cloudStorage.service.ts  # Logic upload S3 / local
└── util/
    └── multherMemory.ts  # Multer memory storage config
```
