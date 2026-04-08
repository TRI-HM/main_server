/**
 * Global error handler middleware.
 *
 * Phải được đăng ký CUỐI CÙNG trong app.ts (sau tất cả routes),
 * vì Express nhận diện error handler qua 4 tham số (err, req, res, next).
 *
 * Bắt tất cả lỗi được throw hoặc truyền qua next(err) từ bất kỳ route nào.
 * Trả về HTTP 500 kèm message lỗi.
 *
 * Sử dụng: app.use(errorHandler) — đặt sau app.use(routes)
 *
 * TODO: phân loại lỗi theo type (ValidationError → 400, NotFoundError → 404, ...)
 *       để không trả 500 cho tất cả trường hợp.
 */

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Log stack trace để debug — nên thay bằng logger có level khi production
  console.error(err.stack);

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || "Internal server error" });
};
