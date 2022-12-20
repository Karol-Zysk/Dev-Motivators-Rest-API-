import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app.error";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el) => {
    if (el instanceof Error) {
      el.message;
    }
  });

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(400, message);
};

const handleJsonWebTokenError = () =>
  new AppError(401, "Invalid token, please log in again");

const handleTokenExpiredError = () => new AppError(401, "session has expired");

const errorSendDev = (err: any, req: Request, res: Response) => {
  //CHECK IF API ERROR
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const errorSendProd = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error("ERROR 💥", err);
    return res.status(err.statusCode).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later",
  });
};

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errorSendDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === `ValidationError`) error = handleValidationErrorDB(error);
    if (err.name === `JsonWebTokenError`) error = handleJsonWebTokenError();
    if (err.name === `TokenExpiredError`) error = handleTokenExpiredError();

    errorSendProd(error, req, res);
  }
};

export default errorMiddleware;
