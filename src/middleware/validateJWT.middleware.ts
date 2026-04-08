/**
 * Middleware xác thực JWT (JSON Web Token).
 *
 * Dùng để bảo vệ các route yêu cầu đăng nhập.
 * Client phải gửi token trong header theo chuẩn:
 *   Authorization: Bearer <token>
 *
 * Nếu hợp lệ: gắn thông tin user đã decode vào `req.user` rồi gọi next().
 * Nếu không hợp lệ: trả về 401 Unauthorized.
 *
 * Sử dụng: gắn vào route cần bảo vệ
 *   router.get("/protected", validateJWTMiddleware, controller.handler)
 */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import ioCustom from "../util/ioCustom";

export type RequestWithUser = Request & {
  user?: string | JwtPayload;
};

export const validateJWTMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  // JWT_SECRET chưa được cấu hình trong .env → lỗi server
  if (!jwtSecret) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ioCustom.toResponseError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "JWT secret is not configured on server (JWT_SECRET missing).",
      })
    );
    return;
  }

  // Thiếu header Authorization hoặc không đúng định dạng Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json(
      ioCustom.toResponseError({
        code: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized: missing Authorization Bearer token.",
      })
    );
    return;
  }

  // Tách token ra khỏi "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json(
      ioCustom.toResponseError({
        code: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized: missing token.",
      })
    );
    return;
  }

  // Verify chữ ký và hạn sử dụng của token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Gắn payload vào request để controller downstream dùng
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json(
      ioCustom.toResponseError({
        code: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized: invalid or expired token.",
      })
    );
    return;
  }
};
