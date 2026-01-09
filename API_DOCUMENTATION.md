# API Documentation - Check In Play Game Backend

## Base URL
```
http://your-domain.com/game/pepsi
```

## Authentication

Hầu hết các API yêu cầu authentication thông qua JWT token. Token được gửi trong header `Authorization` theo format:

```
Authorization: Bearer <token>
```

Token có thời hạn 5 giờ sau khi đăng nhập.

---

## API Endpoints

### 1. Player APIs

#### 1.1. Tạo Player mới
**Endpoint:** `POST /createPlayer`

**Description:** Tạo tài khoản player mới

**Request Body:**
```json
{
  "username": "string",
  "phone": "string",
  "email": "string (optional)",
  "verifyCode": "string (optional)"
}
```

**Response Success (200):**
```json
{
  "message": "Player created successfully",
  "data": {
    "id": "number",
    "username": "string",
    "phone": "string",
    "redeem": 0,
    "played_1": 0,
    "played_2": 0,
    "played_3": 0,
    "played_4": 0,
    "played_5": 0,
    "redeemAble": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

**Response Error (400):**
```json
{
  "message": "Username and phone are required"
}
```

**Response Error (400):**
```json
{
  "message": "Player already exists"
}
```

---

#### 1.2. Đăng nhập Player
**Endpoint:** `POST /signin`

**Description:** Đăng nhập player và nhận JWT token

**Request Body:**
```json
{
  "phone": "string",
  "username": "string"
}
```

**Response Success (200):**
```json
{
  "message": "User signed in",
  "data": {
    "phone": "string",
    "token": "jwt_token_string"
  }
}
```

**Response Error (400):**
```json
{
  "message": "Phone and username are required"
}
```

**Response Error (400):**
```json
{
  "message": "Player not found"
}
```

---

#### 1.3. Lấy thông tin Player hiện tại
**Endpoint:** `GET /getPlayerSelf`

**Description:** Lấy thông tin player đang đăng nhập (dùng để verify token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "message": "Player found",
  "data": {
    "id": "number",
    "username": "string",
    "phone": "string",
    "redeem": 0,
    "played_1": 0,
    "played_2": 0,
    "played_3": 0,
    "played_4": 0,
    "played_5": 0,
    "redeemAble": 0,
    "played_1_at": null,
    "played_2_at": null,
    "played_3_at": null,
    "played_4_at": null,
    "played_5_at": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

**Response Error (400):**
```json
{
  "message": "Token is required"
}
```

**Response Error (400):**
```json
{
  "message": "Invalid token"
}
```

---

#### 1.4. Check-in vào Booth chơi game
**Endpoint:** `POST /checkInPlayGame`

**Description:** Đánh dấu player đã chơi tại một booth (1-5)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "boothId": 1
}
```

**Booth IDs:**
- `1` → played_1
- `2` → played_2
- `3` → played_3
- `4` → played_4
- `5` → played_5

**Response Success (200):**
```json
{
  "message": "Player checked in play game successfully",
  "data": {
    "id": "number",
    "username": "string",
    "phone": "string",
    "played_1": 1,
    "played_1_at": "2024-01-01T00:00:00.000Z",
    ...
  }
}
```

**Response Error (400):**
```json
{
  "message": "Token is required"
}
```

**Response Error (400):**
```json
{
  "message": "boothId are required"
}
```

**Response Error (400):**
```json
{
  "message": "Invalid boothId"
}
```

---

### 2. Admin APIs

#### 2.1. Tạo Admin
**Endpoint:** `POST /createAdmin`

**Description:** Tạo tài khoản admin mới

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Success (200):**
```json
{
  "message": "Admin created successfully",
  "data": {
    "id": "string",
    "username": "string",
    "password": "hashed_password",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

**Response Error (400):**
```json
{
  "message": "Username and password are required"
}
```

---

#### 2.2. Đăng nhập Admin
**Endpoint:** `POST /adminSignin`

**Description:** Đăng nhập admin và nhận JWT token

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Success (200):**
```json
{
  "message": "Admin signed in successfully",
  "data": {
    "username": "string",
    "token": "jwt_token_string"
  }
}
```

**Response Error (400):**
```json
{
  "message": "Invalid username or password"
}
```

---

#### 2.3. Lấy danh sách tất cả Players
**Endpoint:** `GET /getAllPlayers`

**Description:** Lấy danh sách tất cả players (chỉ admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `limit` (optional): Số lượng players mỗi trang (default: 10)
- `cursorId` (optional): ID của player cuối cùng để phân trang (default: 0)

**Example:**
```
GET /getAllPlayers?limit=20&cursorId=10
```

**Response Success (200):**
```json
{
  "message": "Players found",
  "data": [
    {
      "id": 1,
      "username": "string",
      "phone": "string",
      "redeem": 0,
      ...
    },
    ...
  ]
}
```

**Response Error (400):**
```json
{
  "message": "Token is required"
}
```

**Response Error (400):**
```json
{
  "message": "Admin not found"
}
```

---

### 3. Gift APIs

#### 3.1. Lấy danh sách Gifts
**Endpoint:** `GET /getGifts`

**Description:** Lấy danh sách tất cả gifts (chỉ admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response Success (200):**
```json
{
  "message": "Gifts found",
  "data": [
    {
      "id": 1,
      "name": "string",
      "quantity": 100,
      "is_active": true,
      ...
    },
    ...
  ]
}
```

**Response Error (400):**
```json
{
  "message": "Token is required"
}
```

**Response Error (400):**
```json
{
  "message": "Admin not found"
}
```

---

#### 3.2. Cập nhật Gift
**Endpoint:** `PUT /updateGift`

**Description:** Cập nhật số lượng gift (chỉ admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "giftId": 1,
  "quantity": 150
}
```

**Response Success (200):**
```json
{
  "message": "Gift updated successfully",
  "data": {
    "id": 1,
    "name": "string",
    "quantity": 150,
    "is_active": true,
    ...
  }
}
```

**Response Error (400):**
```json
{
  "message": "Gift ID is required and quantity must be greater than 0"
}
```

---

### 4. Booth Staff APIs

#### 4.1. Tạo Booth Staff
**Endpoint:** `POST /boothStaff`

**Description:** Tạo tài khoản booth staff mới

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "boothNumber": 1
}
```

**Response Success (200):**
```json
{
  "message": "Booth staff created successfully",
  "data": {
    "id": "string",
    "username": "string",
    "password": "hashed_password",
    "boothNumber": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

**Response Error (400):**
```json
{
  "message": "Username, password and boothNumber are required"
}
```

---

#### 4.2. Đăng nhập Booth Staff
**Endpoint:** `POST /boothStaff/signin`

**Description:** Đăng nhập booth staff và nhận JWT token

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Success (200):**
```json
{
  "message": "Booth staff signed in successfully",
  "data": {
    "username": "string",
    "token": "jwt_token_string",
    "boothNumber": 1
  }
}
```

**Response Error (400):**
```json
{
  "message": "Invalid username or password"
}
```

---

#### 4.3. Lấy thông tin một Booth Staff
**Endpoint:** `GET /boothStaff/:id`

**Description:** Lấy thông tin một booth staff theo ID

**Path Parameters:**
- `id`: ID của booth staff

**Response Success (200):**
```json
{
  "message": "Booth staff found",
  "data": {
    "id": "string",
    "username": "string",
    "password": "hashed_password",
    "boothNumber": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

**Response Error (404):**
```json
{
  "message": "Booth staff not found"
}
```

---

#### 4.4. Lấy danh sách tất cả Booth Staffs
**Endpoint:** `GET /boothStaff`

**Description:** Lấy danh sách tất cả booth staffs

**Response Success (200):**
```json
{
  "message": "Booth staffs found",
  "data": [
    {
      "id": "string",
      "username": "string",
      "boothNumber": 1,
      ...
    },
    ...
  ]
}
```

---

#### 4.5. Cập nhật Booth Staff
**Endpoint:** `PUT /boothStaff/:id`

**Description:** Cập nhật thông tin booth staff

**Path Parameters:**
- `id`: ID của booth staff

**Request Body:**
```json
{
  "username": "string (optional)",
  "password": "string (optional)",
  "boothNumber": 2
}
```

**Response Success (200):**
```json
{
  "message": "Booth staff updated successfully",
  "data": {
    "id": "string",
    "username": "string",
    "boothNumber": 2,
    ...
  }
}
```

**Response Error (400):**
```json
{
  "message": "ID is required"
}
```

---

#### 4.6. Xóa Booth Staff
**Endpoint:** `DELETE /boothStaff/:id`

**Description:** Xóa booth staff

**Path Parameters:**
- `id`: ID của booth staff

**Response Success (200):**
```json
{
  "message": "Booth staff deleted successfully"
}
```

**Response Error (400):**
```json
{
  "message": "Failed to delete booth staff"
}
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing required fields or invalid data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Data Models

### Player Model
```typescript
{
  id: number;
  username: string;
  phone: string;
  redeem: number;
  played_1: number;
  played_2: number;
  played_3: number;
  played_4: number;
  played_5: number;
  redeemAble: number;
  played_1_at: Date | null;
  played_2_at: Date | null;
  played_3_at: Date | null;
  played_4_at: Date | null;
  played_5_at: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
```

### Admin Model
```typescript
{
  id: string;
  username: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
```

### Booth Staff Model
```typescript
{
  id: string;
  username: string;
  password: string; // hashed
  boothNumber: number;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
```

### Gift Model
```typescript
{
  id: number;
  name: string;
  quantity: number;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
```

---

## Authentication Flow

### Player Flow:
1. Tạo player: `POST /createPlayer`
2. Đăng nhập: `POST /signin` → Nhận token
3. Lưu token vào localStorage/sessionStorage
4. Gửi token trong header `Authorization: Bearer <token>` cho các request tiếp theo
5. Verify token: `GET /getPlayerSelf` (khi vào trang chủ)

### Admin Flow:
1. Tạo admin: `POST /createAdmin` (chỉ lần đầu)
2. Đăng nhập: `POST /adminSignin` → Nhận token
3. Lưu token và sử dụng cho các API admin

### Booth Staff Flow:
1. Tạo booth staff: `POST /boothStaff` (chỉ admin)
2. Đăng nhập: `POST /boothStaff/signin` → Nhận token
3. Lưu token và sử dụng cho các API booth staff

---

## Notes

- Tất cả password được hash bằng bcrypt trước khi lưu vào database
- JWT token có thời hạn 5 giờ
- Token phải được gửi trong header `Authorization` với format `Bearer <token>`
- Các API yêu cầu authentication sẽ trả về lỗi 400 nếu thiếu hoặc token không hợp lệ
- Timestamp được trả về dưới dạng ISO 8601 format

---

## Example Requests

### JavaScript/Fetch Example:
```javascript
// Đăng nhập
const response = await fetch('http://your-domain.com/game/pepsi/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '0123456789',
    username: 'player1'
  })
});

const data = await response.json();
const token = data.data.token;

// Lưu token
localStorage.setItem('authToken', token);

// Gọi API với token
const playerResponse = await fetch('http://your-domain.com/game/pepsi/getPlayerSelf', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### cURL Example:
```bash
# Đăng nhập
curl -X POST http://your-domain.com/game/pepsi/signin \
  -H "Content-Type: application/json" \
  -d '{"phone":"0123456789","username":"player1"}'

# Lấy thông tin player
curl -X GET http://your-domain.com/game/pepsi/getPlayerSelf \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Last Updated:** 2024-01-07

