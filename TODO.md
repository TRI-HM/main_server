# TODO — TRI-Data Main Server

> Cập nhật lần cuối: 2026-03-31

---

## CRITICAL — Bảo mật (làm ngay)

- [ ] **Fix register endpoint không lưu password**
  - File: `src/domain/login/controller.ts:12`
  - Hash bcrypt đang được tạo nhưng không lưu vào DB → ai cũng đăng ký và đăng nhập được
  - Cần: lưu `hashedPassword` vào field password của User model

- [ ] **Fix sign-in không verify password với DB**
  - File: `src/domain/login/controller.ts`
  - Hiện tại không so sánh password nhập vào với hash trong DB
  - Cần: `bcrypt.compare(password, user.password)`

- [ ] **Chuyển OTP từ JSON file sang Redis**
  - Hiện tại: `/public/otp/{phone}.json` — plaintext, không an toàn
  - Redis đã cài sẵn (`redis` package) nhưng chưa dùng
  - Cần: lưu OTP vào Redis với TTL, xóa sau khi verify

- [ ] **Chuyển Zalo tokens từ localStorage file sang Redis**
  - Hiện tại: `localStorage/zalo_access_token`, `zalo_refresh_token`, `zalo_access_token_expires_at`
  - Vấn đề: plaintext, không scale, mất khi restart container nếu không mount volume
  - Cần: lưu vào Redis với TTL = `expires_in`
  - Xem: `src/domain/zalo/controller.ts`, `src/domain/zaloOTP/controller.ts`

- [ ] **Xóa credentials khỏi git history**
  - `.env` đang chứa Zalo API keys, S3 credentials, JWT secret
  - Cần: rotate tất cả keys, dùng `.env.example` với placeholder, thêm `.env` vào `.gitignore`

- [ ] **S3 credentials hardcode trong code**
  - File: `src/services/storage/cloudStorage.service.ts:6-14`
  - Cần: chuyển sang environment variables

---

## HIGH — Lỗi logic

- [ ] **Booth login không validate password**
  - File: `src/domain/game/checkIn/boothAccount/controller.ts`
  - Cần: thêm `bcrypt.compare` khi đăng nhập booth account

- [ ] **Zalo webhook không validate signature**
  - File: `src/domain/zalo/controller.ts:8-14`
  - Cần: verify HMAC signature từ Zalo theo docs của Zalo OA

- [ ] **Thêm rate limiting cho OTP endpoint**
  - Endpoint `/api/game/check-in/getOTP` không có giới hạn → dễ bị spam
  - Cần: `express-rate-limit` — max 3-5 OTP/phone/phút

- [ ] **File upload không giới hạn mimetype**
  - File: `src/domain/image/controller.ts`
  - Cần: whitelist mimetype (image/jpeg, image/png, image/webp)

- [ ] **Thêm auth middleware cho các game endpoints còn thiếu**
  - Kiểm tra và áp dụng `Authenticated` middleware lên các route cần bảo vệ

---

## MEDIUM — Chất lượng code

- [ ] **Thêm input validation (zod hoặc joi)**
  - Hiện tại không validate format email, phone, required fields
  - Cần: validation middleware cho tất cả request body

- [ ] **Merge code trùng lặp giữa `zalo/` và `zaloOTP/`**
  - Logic lấy/refresh Zalo token bị copy y hệt ở 2 controller
  - Cần: extract thành `src/services/zalo/tokenManager.ts`

- [ ] **Chuẩn hóa response format**
  - Hiện tại mix giữa direct object và wrapped response
  - Cần: dùng nhất quán `{ success, data, message }` hoặc tương tự

- [ ] **Thay console.log bằng structured logging**
  - Cần: `winston` hoặc `pino` với log levels (debug, info, warn, error)
  - Thêm request ID để trace request

- [x] **Viết tests**
  - `scripts/runTests.ts` tồn tại nhưng không có test file nào
  - Bắt đầu với: services và use cases (unit test)
  - Sau đó: API integration tests

- [ ] **Thêm database indexes**
  - `phone` trong `CheckInPlayer` — thường xuyên được query
  - `username` trong `BoothAccount`
  - `boothCode` trong `PlayerBoothProgress`

---

## LOW — Cải tiến kiến trúc

- [ ] **Kích hoạt và sử dụng Redis cho caching**
  - Redis đã cài nhưng chưa cache gì
  - Candidate: booth list, gift list (ít thay đổi, query nhiều)

- [ ] **Thêm graceful shutdown**
  - Xử lý `SIGTERM`, `SIGINT` để đóng DB connection và Socket.IO sạch

- [ ] **API versioning**
  - Prefix routes thành `/v1/api/...` để dễ maintain về sau

- [ ] **OpenAPI / Swagger documentation**
  - `API_DOCUMENTATION.md` đang outdated
  - Cần: `swagger-ui-express` + `zod-to-openapi` hoặc tương tự

- [ ] **Xử lý N+1 query**
  - Thêm `include` (eager loading) khi query có relationship
  - Ví dụ: `PlayerBoothProgress` với `CheckInPlayer` và `Booth`

- [ ] **Không có cơ chế token refresh cho JWT**
  - JWT hiện tại hết hạn sau 1 giờ, không có refresh token
  - Cần: thêm refresh token endpoint hoặc tăng expiry hợp lý

---

## Đã hoàn thành

- [x] Tích hợp AWS S3 (ViettelIDC) cho cloud storage
- [x] Zalo ZNS OTP flow
- [x] Socket.IO real-time events
- [x] JWT authentication middleware
- [x] Sequelize migrations
- [x] Docker deployment setup
- [x] Soft delete (paranoid mode) trên tất cả models
