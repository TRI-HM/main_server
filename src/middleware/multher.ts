import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../../public/images/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const filename = path.parse(file.originalname).name;
    const fileExtension = path.extname(file.originalname);
    cb(null, filename + '-' + uniqueSuffix + fileExtension); // Tên file lưu trữ
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