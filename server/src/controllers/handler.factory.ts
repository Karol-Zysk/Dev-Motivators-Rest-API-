import { Request, Response } from "express";
import Motivator, { Place } from "../models/motivator.model";
import { APIFeatures } from "../utils/apiFeatures";
import { catchAsync } from "../utils/catchAsync";

export const getMotivators = (place: Place) =>
  catchAsync(async (req: Request, res: Response) => {
    const features = new APIFeatures(Motivator.find({ place }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const motivators = await features.query;

    res.status(200).json({
      status: "success",
      lenght: motivators.length,
      motivators,
    });
  });

export const getUserMotivators = catchAsync(
  async (req: Request, res: Response) => {
    let authorId;
    if (req.params.id) {
      authorId = req.params.id;
    } else {
      authorId = res.locals.user.id;
    }

    const features = new APIFeatures(
      Motivator.find({ author: authorId }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const motivators = await features.query;

    res.status(200).json({
      status: "success",
      lenght: motivators.length,
      motivators,
    });
  }
);
