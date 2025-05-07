import express from 'express';
import fs from 'fs';
import path from 'path';
import mime from 'mime';  // npm install mime
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();
const PORT = process.env.APP_PORT || 4000;
const IMAGE_DIR = process.env.IMAGE_DIR || '/path/to/images';

app.get('/internal/image/:uuid', (req, res) => {
  const { uuid } = req.params;


  // Giả sử file lưu với đúng tên uuid + .jpg
  // Nếu bạn có nhiều định dạng, có thể thử các extension khác nhau
  const filePath = path.join(IMAGE_DIR, `${uuid}.jpg`);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Image not found');
    }

    const contentType = mime.getType(filePath) || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`Image service listening on port ${PORT}`);
});
