import { NextFunction, Request, Response } from "express";

export const setUserId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body.motivator) req.body.motivator = req.params.id;
    if (!req.body.author) req.body.author = res.locals.user._id;
  
    next();
  };