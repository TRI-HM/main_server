import { NextFunction, RequestHandler, Request, Response } from "express";

export const wrapAsync = (handler: RequestHandler): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => Promise.resolve(handler(req, res, next)).catch(next);
};
