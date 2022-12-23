import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app.error";
import log from "../utils/logger";
const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = Number(error.status) || 500;
    // const message: string = error || "Something went wrong";
    log.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${error.message}, stack: ${error.stack}`
    );

    res.status(status).json({ error });
  } catch (error) {
    next(error);
  }
};
export default errorMiddleware;
