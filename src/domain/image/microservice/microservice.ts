import express from 'express';
import fs from 'fs';
import path from 'path';
import mime from 'mime';            // npm install mime
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 4000;
// Thư mục lưu ảnh, có thể cấu hình qua biến môi trường
const IMAGE_DIR = process.env.IMAGE_DIR || '/path/to/images';
// Token để xác thực (phải trùng với server proxy dùng)
const APP_API_TOKEN = process.env.APP_API_TOKEN;

app.get('/internal/image/:uuid', (req, res) => {
  // 1. Xác thực Bearer token nếu cần
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${APP_API_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { uuid } = req.params;
  // 2. Xây dựng đường dẫn file (thêm extension nếu biết trước, hoặc tìm file phù hợp)
  //    Ví dụ ở đây giả định file là .jpg
  const filePath = path.join(IMAGE_DIR, `${uuid}.jpg`);

  // 3. Kiểm tra file có tồn tại không
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // 4. Xác định MIME type (image/jpeg, image/png…)
    const contentType = mime.getType(filePath) || 'application/octet-stream';

    // 5. Thiết lập header và stream file về client
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      // Có thể thêm Cache-Control, ETag…
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`App nội bộ listening on port ${PORT}`);
});
