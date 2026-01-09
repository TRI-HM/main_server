import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ioCustom from "../util/ioCustom";

/**
 * Middleware để kiểm tra tính hợp lệ của file gửi từ client qua form-data.
 * - Kiểm tra có file không.
 * - Kiểm tra loại file (chỉ chấp nhận video cho các middleware upload video).
 * - Kiểm tra kích thước file (giới hạn ví dụ: 200 MB).
 */
const MAX_VIDEO_FILE_SIZE = 200 * 1024 * 1024; // 200 MB

export const validateVideoFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).json(ioCustom.toResponseError({
            code: StatusCodes.BAD_REQUEST,
            message: 'Không có file nào được tải lên. Đảm bảo trong form-data có trường "video" (type: File).',
        }));
        return;
    }

    // Kiểm tra loại file: chỉ chấp nhận video
    if (!req.file.mimetype.startsWith('video/')) {
        res.status(StatusCodes.BAD_REQUEST).json(ioCustom.toResponseError({
            code: StatusCodes.BAD_REQUEST,
            message: 'Không phải file video! Chỉ chấp nhận file video.',
        }));
        return;
    }

    // Kiểm tra kích thước file (nếu cần)
    if (req.file.size > MAX_VIDEO_FILE_SIZE) {
        res.status(StatusCodes.BAD_REQUEST).json(ioCustom.toResponseError({
            code: StatusCodes.BAD_REQUEST,
            message: `File video quá lớn! Giới hạn là ${MAX_VIDEO_FILE_SIZE / (1024 * 1024)} MB.`,
        }));
        return;
    }

    next();
};
