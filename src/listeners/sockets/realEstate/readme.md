# realEstate.controller.ts

## Mục đích
Quản lý các chức năng liên quan đến bất động sản qua socket.

## Các chức năng chính
- Lắng nghe sự kiện từ client liên quan đến bất động sản.
- Xử lý yêu cầu lấy danh sách, thêm, sửa, xóa bất động sản.
- Gửi phản hồi về trạng thái và dữ liệu cho client.

## Các phương thức tiêu biểu
- `getRealEstates`: Lấy danh sách bất động sản.
- `createRealEstate`: Tạo mới một bất động sản.
- `updateRealEstate`: Cập nhật thông tin bất động sản.
- `deleteRealEstate`: Xóa bất động sản.

## Sử dụng
Import controller vào socket listener và đăng ký các sự kiện cần xử lý.

## Lưu ý
- Đảm bảo xác thực người dùng trước khi thực hiện các thao tác.
- Kiểm tra dữ liệu đầu vào để tránh lỗi.
