import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ioCustom from "../util/ioCustom";

/**
 * Middleware validate API key cho Flux endpoints.
 * Client gửi API key trong header: `x-api-key: <key>`
 */
export const validateAPIKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const providedApiKey = req.headers["x-api-key"];
  const expectedApiKey = process.env.FLUX_API_KEY;

  // Nếu chưa cấu hình key ở server thì chặn và báo lỗi cấu hình.
  if (!expectedApiKey) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ioCustom.toResponseError({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "x-api-key is not configured on server (FLUX_API_KEY missing).",
        })
      );
    return;
  }

  // Node/Express sẽ trả headers dưới dạng string hoặc string[]
  const provided = Array.isArray(providedApiKey) ? providedApiKey[0] : providedApiKey;

  if (!provided || provided !== expectedApiKey) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ioCustom.toResponseError({
          code: StatusCodes.UNAUTHORIZED,
          message: "Unauthorized: invalid or missing x-api-key header.",
        })
      );
    return;
  }

  next();
};

