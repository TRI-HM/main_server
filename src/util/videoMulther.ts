import multer from "multer";
import path from "path";
import fs from "fs";
import { generateFileNameWithTime, getDateFolderName } from "./generateNameWithTime";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tạo folder theo format yyyymmdd
    const dateFolder = getDateFolderName();
    const uploadsDir = path.join(__dirname, '../../public/videos/uploads', dateFolder);
    console.log('uploadsDir', uploadsDir);
    // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo mới
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    // Trả về đường dẫn tương đối từ root của project
    cb(null, `public/videos/uploads/${dateFolder}/`);
  },
  // Đặt tên file lưu trữ theo định dạng: mmssSSS-randomNumber-originalName
  filename: function (req, file, cb) {
    const uniqueCode = generateFileNameWithTime(); // Tạo mã số random dựa trên minute, second, millisecond
    cb(null, uniqueCode + '-' + file.originalname); // Kết hợp mã số với tên file gốc
  }
});

// Lọc file - chỉ cho phép các file video
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Chấp nhận các định dạng video phổ biến
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Không phải file video! Chỉ chấp nhận file video.'));
  }
};

// Cấu hình multer
export const uploadVideoMulterHandle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // Giới hạn kích thước file tối đa là 200MB
  }
});