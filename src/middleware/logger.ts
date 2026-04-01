/**
 * Request logger middleware.
 *
 * Log mỗi HTTP request vào console theo format:
 *   [timestamp] METHOD /path
 *
 * Được đăng ký sớm trong app.ts để bắt tất cả requests.
 *
 * Sử dụng: app.use(logger)
 *
 * TODO: thay console.log bằng winston/pino với log levels,
 *       thêm request ID, response time, và status code.
 */

import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
