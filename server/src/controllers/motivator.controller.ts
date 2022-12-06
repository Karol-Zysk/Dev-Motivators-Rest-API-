import { Request, Response } from "express";
import Motivator from "../models/motivator.model";
import { APIFeatures } from "../utils/apiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { getMotivators } from "./handlerFactory";

export const createMotivator = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;
    //Need to change this after testing !!!!
    const motivator = await Motivator.create(body);

    return res.send(motivator);
  }
);

export const getAllMotivators = getMotivators();

export const getMotivatorsMain = catchAsync(
  async (req: Request, res: Response) => {
    const features = new APIFeatures(
      Motivator.find({ place: "Main" }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const allMotivators = await features.query;

    res.status(200).json({
      status: "success",
      lenght: allMotivators.length,
      data: {
        allMotivators,
      },
    });
  }
);
