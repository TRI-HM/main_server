import { Request, Response, NextFunction } from "express";

const authenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("Authenticated middleware called");
  next();
}

export default authenticated;