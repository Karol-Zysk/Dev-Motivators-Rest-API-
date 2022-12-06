import { Request, Response } from "express";
import Motivator, { Place } from "../models/motivator.model";
import { APIFeatures } from "../utils/apiFeatures";
import { catchAsync } from "../utils/catchAsync";

export const getMotivators = (place: Place) => {
  return catchAsync(async (req: Request, res: Response) => {
    const features = new APIFeatures(Motivator.find({ place }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const Motivators = await features.query;

    res.status(200).json({
      status: "success",
      lenght: Motivators.length,
      data: {
        Motivators,
      },
    });
  });
};
