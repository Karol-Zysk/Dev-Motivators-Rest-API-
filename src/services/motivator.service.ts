import { NextFunction, Request, Response } from "express";
import Motivator, { MotivatorDocument } from "../models/motivator.model";
import { AppError } from "../utils/app.error";
import { catchAsync } from "../utils/catchAsync";
import log from "../utils/logger";

//THIS FUNCTION CHECKS IF CURRENT USER IS AN AUTHOR
export const authorize = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentMotivator = await Motivator.findById(req.params.id);

    log.info(String(currentMotivator?.author.id) !== res.locals.user.id);
    // const userId = res.locals.user.id;

    if (!currentMotivator) {
      return next(new AppError(404, `Motivator with this id doesn't exist`));
    }

    //CHEK IF CURRENT USER IS AUTHOR
    if (String(currentMotivator?.author.id) !== res.locals.user.id) {
      return next(new AppError(404, `Current user is not an author`));
    }
    next();
  }
);

export const checkIfAlreadyVoted = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const motivator = await Motivator.findById(req.params.id);

    const like = motivator?.thumbUp.includes(res.locals.user.id);
    const disLike = motivator?.thumbDown.includes(res.locals.user.id);

    const voted = like || disLike;

    if (voted) {
      return res
        .status(403)
        .json({ status: "fail", message: "You've already voted" });
    }
    next();
  }
);
