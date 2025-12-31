import { Request, Response } from "express";
import { wrapAsync } from "../../util/wrapAsync";
import axios from "axios";

const getOne = wrapAsync(
  async (req: Request, res: Response) => {
    let uuid: string = req.params.uuid;
    const redisHost = process.env.MICROSERVICE_REDIS_HOST || "http://localhost:3000";
    console.log("Redis host: ", redisHost);
    try {
      // Gửi request đến App để lấy ảnh, dùng responseType=stream để stream trực tiếp
      const response = await axios.get(`${redisHost}/internal/image/${uuid}`, {
        responseType: 'stream',
        timeout: 5000,          // timeout để tránh treo lâu
        // headers: {
        //   'Authorization': `Bearer ${process.env.APP_API_TOKEN}` // nếu cần auth
        // }
      });

      // Chuyển nguyên header Content-Type, Content-Length từ app về client
      res.set({
        'Content-Type': response.headers['content-type'],
        'Content-Length': response.headers['content-length'],
        // Cache-Control, ETag... nếu cần cache
      });

      // Stream dữ liệu ảnh thẳng về client
      return response.data.pipe(res);

    } catch (err) {
      console.error('Lỗi khi lấy ảnh từ app', err);
      // if (err.response && err.response.status === 404) {
      //   res.status(404).json({ error: 'Không tìm thấy ảnh với uuid này' });
      // } else {
      //   res.status(502).json({ error: 'Lỗi kết nối đến dịch vụ ảnh nội bộ' });
      // }
    }
  }
);

const upload = wrapAsync(
  async (req: Request, res: Response) => {
    try {
      // Kiểm tra xem file có tồn tại không
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Không có file ảnh nào được tải lên'
        });
        return;
      }

      // Lấy thông tin từ form
      const description = req.body.description || 'Không có mô tả';

      // Thông tin về file đã tải lên
      const fileInfo = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `${process.env.BASE_URL}/images/uploads/${req.file.filename}`, // Đường dẫn đến ảnh đã tải lên
        qrcode: `${process.env.BASE_URL_QRCODE}/user?id=${req.file.filename}`, // Đường dẫn đến ảnh đã tải lên
        description: description
      };

      console.log('File đã tải lên:', fileInfo);

      // Trả về kết quả thành công
      res.status(200).json({
        success: true,
        message: 'Tải lên ảnh thành công',
        data: fileInfo
      });

    } catch (error) {
      console.error('Lỗi khi tải lên ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi tải lên ảnh',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

const imageController = {
  getOne,
  upload,
};
export default imageController;