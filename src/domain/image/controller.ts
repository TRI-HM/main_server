import { Request, Response } from "express";
import { wrapAsync } from "../../middleware/wrapAsync";
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

const imageController = {
  getOne,
};
export default imageController;