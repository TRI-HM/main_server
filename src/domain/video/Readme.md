# Video API Documentation

## Tổng quan

API này cho phép upload video lên server. File video sẽ được lưu trữ trong thư mục `public/videos/uploads/{yyyyMMdd}/` với tên file được tạo tự động theo format: `{mmssSSS-randomNumber}-{originalName}`.

## Endpoint

```
POST /api/video/post
```

## Request

### Headers

| Key | Value | Required |
|-----|-------|----------|
| Content-Type | multipart/form-data | Yes |

### Body (form-data)

| Key | Type | Required | Mô tả |
|-----|------|----------|-------|
| video | File | Yes | File video cần upload (chỉ chấp nhận file video) |
| description | String | No | Mô tả về video (mặc định: "Không có mô tả") |
| phone | String | No | Số điện thoại liên kết với video |

### Ví dụ Request (Postman)

1. **Method**: `POST`
2. **URL**: `http://localhost:9456/api/video/post`
3. **Body**: 
   - Chọn tab **Body**
   - Chọn **form-data**
   - Thêm các key-value pairs:
     - **Key**: `video`, **Type**: `File`, **Value**: Chọn file video từ máy tính
     - **Key**: `description`, **Type**: `Text`, **Value**: (Optional) Mô tả video
     - **Key**: `phone`, **Type**: `Text`, **Value**: (Optional) Số điện thoại

### Giới hạn

- **File size**: Tối đa `10 * 1080 * 1920` bytes (~20.7 MB)
- **File type**: Chỉ chấp nhận file video (mimetype bắt đầu bằng `video/`)
  - Các định dạng được hỗ trợ: `.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`, v.v.

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Tải lên video thành công",
  "data": {
    "filename": "2855135-146737508-random_image.mp4",
    "originalname": "random_image.mp4",
    "mimetype": "video/mp4",
    "size": 596249,
    "path": "public\\videos\\uploads\\20251212\\2855135-146737508-random_image.mp4",
    "url": "http://171.244.201.165:9456/videos/uploads/20251212/2855135-146737508-random_image.mp4",
    "qrcode": "http://192.168.1.100:5173/video?id=2855135-146737508-random_image.mp4",
    "description": "Không có mô tả"
  }
}
```

#### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| success | Boolean | Trạng thái thành công |
| message | String | Thông báo kết quả |
| data | Object | Thông tin về file đã upload |
| data.filename | String | Tên file đã được lưu trên server (format: `{mmssSSS-randomNumber}-{originalName}`) |
| data.originalname | String | Tên file gốc từ client |
| data.mimetype | String | MIME type của file (vd: `video/mp4`) |
| data.size | Number | Kích thước file (bytes) |
| data.path | String | Đường dẫn file trên server |
| data.url | String | URL công khai để truy cập video |
| data.qrcode | String | URL QR code để truy cập video qua frontend |
| data.description | String | Mô tả về video |

### Error Responses

#### 400 Bad Request - Không có file video

```json
{
  "success": false,
  "message": "Không có file video nào được tải lên",
  "hint": "Đảm bảo trong Postman: Body -> form-data -> Key: \"video\" (Type: File)"
}
```

#### 400 Bad Request - File không phải video

```json
{
  "success": false,
  "message": "Không phải file video! Chỉ chấp nhận file video."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Đã xảy ra lỗi khi tải lên video",
  "error": "Error message details"
}
```

## Ví dụ sử dụng

### cURL

```bash
curl -X POST http://localhost:9456/api/video/post \
  -F "video=@/path/to/your/video.mp4" \
  -F "description=Video mô tả sản phẩm" \
  -F "phone=0123456789"
```

### JavaScript (Fetch API)

```javascript
const formData = new FormData();
formData.append('video', videoFile); // videoFile là File object
formData.append('description', 'Mô tả video');
formData.append('phone', '0123456789');

fetch('http://localhost:9456/api/video/post', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => {
    console.log('Upload thành công:', data);
    console.log('Video URL:', data.data.url);
  })
  .catch(error => {
    console.error('Lỗi upload:', error);
  });
```

### Postman

1. Mở Postman
2. Tạo request mới với method `POST`
3. Nhập URL: `http://localhost:9456/api/video/post`
4. Vào tab **Body**
5. Chọn **form-data**
6. Thêm key `video` với type là **File** và chọn file video
7. (Optional) Thêm key `description` với type **Text**
8. (Optional) Thêm key `phone` với type **Text**
9. Click **Send**

## Lưu trữ File

- **Thư mục lưu trữ**: `public/videos/uploads/{yyyyMMdd}/`
  - Ví dụ: `public/videos/uploads/20251212/`
- **Định dạng tên file**: `{mmssSSS-randomNumber}-{originalName}`
  - `mmssSSS`: Phút, giây, millisecond
  - `randomNumber`: Số ngẫu nhiên 9 chữ số
  - `originalName`: Tên file gốc
  - Ví dụ: `2855135-146737508-random_image.mp4`

## Truy cập Video

Sau khi upload thành công, video có thể được truy cập qua:
- **Public URL**: `{BASE_URL}/videos/uploads/{yyyyMMdd}/{filename}`
- **QR Code URL**: `{BASE_URL_QRCODE}/video?id={filename}`

## Database

Video được lưu vào bảng `videos` trong database với các thông tin:
- `file_name`: Tên file đã lưu
- `file_path`: URL đầy đủ của video
- `phone`: Số điện thoại (nếu có)
- `is_enabled`: Trạng thái kích hoạt (mặc định: 0)
- `created_at`: Thời gian tạo
- `updated_at`: Thời gian cập nhật
- `deleted_at`: Thời gian xóa (soft delete)

## Notes

- File video sẽ được tự động tổ chức theo ngày (folder yyyyMMdd)
- Tên file được tạo tự động để tránh trùng lặp
- Server hỗ trợ CORS và static file serving cho thư mục videos
- API sử dụng soft delete (không xóa file khỏi database, chỉ đánh dấu `deleted_at`)

