import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import ioCustom from "../util/ioCustom";

export type RequestWithUser = Request & {
  user?: string | JwtPayload;
};

/**
 * Middleware validate JWT theo chuẩn:
 * `Authorization: Bearer <token>`
 */
export const validateJWTMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      ioCustom.toResponseError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "JWT secret is not configured on server (JWT_SECRET missing).",
      })
    );
    return;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json(
      ioCustom.toResponseError({
        code: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized: missing Authorization Bearer token.",
      })
    );
    return;
  }

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

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
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

