import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tạo thư mục lưu trữ file upload nếu chưa tồn tại
    const uploadsDir = path.join(__dirname, '../../public/images/uploads');
    console.log('uploadsDir', uploadsDir);
    // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo mới
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, 'public/images/uploads/'); // Đường dẫn thư mục lưu trữ file upload
  },
  // Đặt tên file lưu trữ theo định dạng: timestamp-randomNumber-originalName
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Tên file lưu trữ
  }
});

// Lọc file - chỉ cho phép các file ảnh
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Chấp nhận các định dạng ảnh phổ biến
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Không phải file ảnh! Chỉ chấp nhận file ảnh.'));
  }
};

// Cấu hình multer
export const uploadMulterHandle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1080 * 1920, // Giới hạn kích thước file tối đa là 10MB
  }
});