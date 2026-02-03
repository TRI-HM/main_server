# Hướng dẫn Test API với Postman

## Base URL

```
http://localhost:3000/api/game/check-in
```

## 1. Player APIs

### 1.1. Tạo Player mới

**Method:** `POST`  
**URL:** `http://localhost:3000/api/game/check-in/player/create`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "nguyenvana@example.com",
  "qrCode": "QR123456789",
  "isCompleted": false
}.
```

**Expected Response (200):**

```json
{
  "message": "Player created successfully",
  "data": {
    "id": "uuid-string",
    "fullName": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "nguyenvana@example.com",
    "qrCode": "QR123456789",
    "isCompleted": false,
    "createdAt": "2026-01-12T..."
  }
}
```

### 1.2. Cập nhật Player

**Method:** `PATCH`  
**URL:** `http://localhost:3000/api/game/check-in/player/update/{id}`  
**Example:** `http://localhost:3000/api/game/pepsi/player/update/abc-123-def`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "fullName": "Nguyễn Văn B",
  "isCompleted": true
}
```

### 1.3. Lấy một Player theo ID

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/player/get/{id}`  
**Example:** `http://localhost:3000/api/game/pepsi/player/get/abc-123-def`

### 1.4. Lấy danh sách Players

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/player/getAll`  
**Query Parameters (Optional):**

- `limit`: số lượng records (default: 10)
- `cursorId`: ID để phân trang (default: 0)

**Example:** `http://localhost:3000/api/game/check-in/player/getAll?limit=20&cursorId=0`

### 1.5. Xóa Player

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/game/check-in/player/delete/{id}`  
**Example:** `http://localhost:3000/api/game/pepsi/player/delete/abc-123-def`

### 1.6. Tìm kiếm Players

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/player/search`  
**Query Parameters:**

- `input`: từ khóa tìm kiếm (phone hoặc fullName)

**Example:** `http://localhost:3000/api/game/check-in/player/search?input=0912`

### 1.7. Kiểm tra Player có tồn tại

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/player/checkExists`  
**Query Parameters:**

- `phone`: số điện thoại cần kiểm tra

**Example:** `http://localhost:3000/api/game/check-in/player/checkExists?phone=0912345678`

---

## 2. Booth APIs

### 2.1. Tạo Booth mới

**Method:** `POST`  
**URL:** `http://localhost:3000/api/game/check-in/booth/create`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "boothCode": "BOOTH001",
  "boothName": "Booth Quà tặng số 1",
  "areaCode": "AREA01",
  "isActive": true
}
```

### 2.2. Cập nhật Booth

**Method:** `PATCH`  
**URL:** `http://localhost:3000/api/game/check-in/booth/update/{boothCode}`  
**Example:** `http://localhost:3000/api/game/pepsi/booth/update/BOOTH001`  
**Body (JSON):**

```json
{
  "boothName": "Booth Quà tặng số 1 - Updated",
  "isActive": false
}
```

### 2.3. Lấy một Booth theo boothCode

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/booth/get/{boothCode}`  
**Example:** `http://localhost:3000/api/game/pepsi/booth/get/BOOTH001`

### 2.4. Lấy danh sách tất cả Booths

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/booth/getAll`

### 2.5. Xóa Booth

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/game/check-in/booth/delete/{boothCode}`  
**Example:** `http://localhost:3000/api/game/pepsi/booth/delete/BOOTH001`

---

## 3. Booth Account APIs

### 3.1. Tạo Booth Account mới

**Method:** `POST`  
**URL:** `http://localhost:3000/api/game/check-in/booth-account/create`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "staff001",
  "password": "password123",
  "boothCode": "BOOTH001",
  "role": "staff",
  "isActive": true
}
```

**Note:** Password nên được hash trước khi lưu vào database.

### 3.2. Cập nhật Booth Account

**Method:** `PATCH`  
**URL:** `http://localhost:3000/api/game/check-in/booth-account/update/{id}`  
**Example:** `http://localhost:3000/api/game/pepsi/booth-account/update/1`  
**Body (JSON):**

```json
{
  "role": "manager",
  "isActive": false
}
```

### 3.3. Lấy Booth Account theo username

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/booth-account/get/{username}`  
**Example:** `http://localhost:3000/api/game/pepsi/booth-account/get/staff001`

---

## 4. Gift APIs

### 4.1. Tạo Gift mới

**Method:** `POST`  
**URL:** `http://localhost:3000/api/game/check-in/gift/create`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "name": "Áo thun",
  "imageUrl": "https://example.com/image.jpg",
  "quantity": 100,
  "quantityRemaining": 100,
  "description": "Áo thun cao cấp",
  "is_active": true
}
```

### 4.2. Cập nhật Gift

**Method:** `PATCH`  
**URL:** `http://localhost:3000/api/game/check-in/gift/update/{id}`  
**Example:** `http://localhost:3000/api/game/pepsi/gift/update/1`  
**Body (JSON):**

```json
{
  "quantityRemaining": 95,
  "is_active": true
}
```

### 4.3. Lấy danh sách tất cả Gifts

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/gift/getAll`

---

## 5. Player Booth Progress APIs

### 5.1. Tạo Player Booth Progress mới

**Method:** `POST`  
**URL:** `http://localhost:3000/api/game/check-in/player-booth-progress/create`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "playerId": "abc-123-def",
  "boothCode": "BOOTH001",
  "verifiedByAccountId": 1,
  "verifiedAt": "2026-01-12T10:00:00.000Z"
}
```

### 5.2. Lấy Player Booth Progress theo boothCode

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/player-booth-progress/booth/{boothCode}`  
**Example:** `http://localhost:3000/api/game/check-in/player-booth-progress/booth/BOOTH001`

### 5.3. Lấy Player Booth Progress theo playerId

**Method:** `GET`  
**URL:** `http://localhost:3000/api/game/check-in/player-booth-progress/player/{playerId}`  
**Example:** `http://localhost:3000/api/game/check-in/player-booth-progress/player/abc-123-def`

---

## Cách Import vào Postman

### Option 1: Tạo Collection thủ công

1. Mở Postman
2. Click "New" → "Collection"
3. Đặt tên: "CheckIn Game APIs"
4. Thêm từng request theo hướng dẫn trên

### Option 2: Sử dụng Environment Variables

Tạo Environment trong Postman:

- Variable: `base_url`
- Initial Value: `http://localhost:3000/api/game/check-in`

Sau đó trong URL sử dụng: `{{base_url}}/player/create`

### Option 3: Test Flow theo thứ tự

1. **Tạo Booth trước:**
   - POST `/booth/create` → Lấy `boothCode`

2. **Tạo Booth Account:**
   - POST `/booth-account/create` → Lấy `id` của account

3. **Tạo Player:**
   - POST `/player/create` → Lấy `id` của player

4. **Tạo Gift:**
   - POST `/gift/create` → Lấy `id` của gift

5. **Tạo Player Booth Progress:**
   - POST `/player-booth-progress/create` (sử dụng các ID đã tạo ở trên)

---

## Lưu ý khi test

1. **Thứ tự tạo dữ liệu:**
   - Booth → Booth Account → Player → Gift → Player Booth Progress

2. **Foreign Keys:**
   - `boothCode` trong `booth_accounts` phải tồn tại trong `booths`
   - `playerId` trong `player_booth_progresses` phải tồn tại trong `check_in_players`
   - `boothCode` trong `player_booth_progresses` phải tồn tại trong `booths`
   - `verifiedByAccountId` trong `player_booth_progresses` phải tồn tại trong `booth_accounts`

3. **Validation:**
   - `phone` trong Player phải unique
   - `boothCode` trong Booth phải unique
   - `username` trong Booth Account phải unique

4. **Error Responses:**
   - `400`: Bad Request (validation failed, missing fields)
   - `404`: Not Found (resource không tồn tại)
   - `500`: Internal Server Error (lỗi server)

---

## Ví dụ Test Case hoàn chỉnh

### Test Case 1: Tạo và quản lý Player

```
1. POST /player/create
   → Lưu playerId từ response

2. GET /player/get/{playerId}
   → Verify data

3. PATCH /player/update/{playerId}
   → Update isCompleted = true

4. GET /player/getAll?limit=10
   → Verify player trong list

5. GET /player/search?input=0912
   → Search by phone

6. DELETE /player/delete/{playerId}
   → Verify deleted
```

### Test Case 2: Tạo Booth và Booth Account

```
1. POST /booth/create
   → Lưu boothCode

2. POST /booth-account/create
   → Sử dụng boothCode từ step 1
   → Lưu accountId

3. GET /booth-account/get/{username}
   → Verify account data

4. POST /player-booth-progress/create
   → Sử dụng boothCode và accountId
```
