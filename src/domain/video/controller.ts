import { Request, Response } from "express"
import { wrapAsync } from "../../middleware/wrapAsync";
import ioCustom from "../../util/ioCustom";
import { StatusCodes } from "http-status-codes";
import videoService from "../../services/video.service";
import { VideoModelType } from "../../models/video.model";
const postVideo = wrapAsync(async (req: Request, res: Response) => {
    try {
        // Kiểm tra xem file có tồn tại không
        if (!req.file) {
            // console.log("Content-Type:", req.headers['content-type']);
            // console.log("req.body keys:", Object.keys(req.body));
            res.status(StatusCodes.BAD_REQUEST)
                .json(ioCustom.toResponseError({
                    code: StatusCodes.BAD_REQUEST,
                    message: 'Không có file video nào được tải lên. Đảm bảo trong Postman: Body -> form-data -> Key: "video" (Type: File)',
                }));
            return;
        }
        // Lấy thông tin từ form
        const description = req.body.description || 'Không có mô tả';
        const phone = req.body.phone || '';


        // Tạo folder date theo format yyyymmdd (giống như trong multer)
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const dateFolder = `${year}${month}${day}`;

        // Tạo URL với folder date
        const videoUrl = `${process.env.BASE_URL}/videos/uploads/${dateFolder}/${req.file.filename}`;

        // Thông tin về file đã tải lên
        const fileInfo = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: videoUrl, // Đường dẫn đến video đã tải lên
            qrcode: `${process.env.BASE_URL_QRCODE}/video?id=${req.file.filename}`, // Đường dẫn đến video đã tải lên
            description: description
        };

        console.log('File đã tải lên:', fileInfo);

        const video: VideoModelType = {
            fileName: req.file.filename,
            filePath: videoUrl,
            phone: req.body.phone,
            isEnabled: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: undefined,
        };
        console.log('Video:', video);
        let newVideo = await videoService.postVideo(video);

        // Trả về kết quả thành công
        res.status(200).json({
            success: true,
            message: 'Tải lên video thành công',
            data: fileInfo
        });

    } catch (error) {
        console.error('Lỗi khi tải lên video:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tải lên video',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

const videoController = {
    postVideo,
};
export default videoController;