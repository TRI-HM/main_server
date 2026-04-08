/**
 * Middleware kiểm tra tính hợp lệ của file video upload.
 *
 * Phải được đặt SAU multer middleware (multer xử lý file trước,
 * sau đó middleware này kiểm tra kết quả trong req.file).
 *
 * Kiểm tra 3 điều kiện:
 *   1. Có file được gửi lên không (req.file tồn tại)
 *   2. Mimetype phải là video/* (video/mp4, video/webm, ...)
 *   3. Kích thước không vượt quá MAX_VIDEO_FILE_SIZE (200 MB)
 *
 * Sử dụng: router.post("/upload", multerMiddleware, validateVideoFileMiddleware, controller)
 */

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ioCustom from "../util/ioCustom";

const MAX_VIDEO_FILE_SIZE = 200 * 1024 * 1024; // 200 MB

export const validateVideoFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Multer chưa nhận được file nào từ form-data
  if (!req.file) {
    res.status(StatusCodes.BAD_REQUEST).json(ioCustom.toResponseError({
      code: StatusCodes.BAD_REQUEST,
      message: 'Không có file nào được tải lên. Đảm bảo trong form-data có trường "video" (type: File).',
    }));
    return;
  }

  // Chỉ chấp nhận file video (video/mp4, video/webm, video/ogg, ...)
  if (!req.file.mimetype.startsWith('video/')) {
    res.status(StatusCodes.BAD_REQUEST).json(ioCustom.toResponseError({
      code: StatusCodes.BAD_REQUEST,
      message: 'Không phải file video! Chỉ chấp nhận file video.',
    }));
    return;
  }

  // Giới hạn kích thước file
  if (req.file.size > MAX_VIDEO_FILE_SIZE) {
    res.status(StatusCodes.BAD_REQUEST).json(ioCustom.toResponseError({
      code: StatusCodes.BAD_REQUEST,
      message: `File video quá lớn! Giới hạn là ${MAX_VIDEO_FILE_SIZE / (1024 * 1024)} MB.`,
    }));
    return;
  }

  next();
};
