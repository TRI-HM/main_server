import { Request, Response } from "express"
import { wrapAsync } from "../../util/wrapAsync";
import ioCustom from "../../util/ioCustom";
import { StatusCodes } from "http-status-codes";
import videoService from "../../services/video.service";
import { VideoClientType } from "../../models/video.model";

const postVideo = wrapAsync(async (req: Request, res: Response) => {
    try {
        const video: Partial<VideoClientType> = {

        };

        res
            .status(StatusCodes.OK)
            .json(ioCustom.toResponse(StatusCodes.OK, 'Tải lên video thành công', req.file || {}));

        // Lấy thông tin từ form
        const description = req.body.description || 'Không có mô tả';
        const phone = req.body.phone || '';

        console.log('description', description);
        console.log('phone', phone);
        console.log('file', req.file?.originalname);
        console.log('file', req.file?.filename);
        console.log('file', req.file?.mimetype);
        console.log('file', req.file?.size);
        console.log('file', req.file?.path);
        console.log('req.body', req.body);

        // Thông tin về file đã tải lên
        // const fileInfo = {
        //     filename: req.file?.filename || '',
        //     originalname: req.file?.originalname || '',
        //     mimetype: req.file?.mimetype || '',
        //     size: req.file?.size || 0,
        //     path: req.file?.path || '',
        //     url: `${process.env.BASE_URL}/videos/uploads/${req.file?.filename}`, // Đường dẫn đến video đã tải lên
        //     qrcode: `${process.env.BASE_URL_QRCODE}/video?id=${req.file?.filename}`, // Đường dẫn đến video đã tải lên
        //     description: description
        // };
        // await videoService.create({
        //     name: req.file?.originalname || '',
        //     phone: phone,
        //     description: description,
        //     filePath: req.file?.path || '',
        //     isEnabled: true,
        //     status: 'pending',
        //     note: '',
        // });

        // // Trả về kết quả thành công
        // res.status(200).json({
        //     success: true,
        //     message: 'Tải lên video thành công',
        //     data: fileInfo
        // });

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