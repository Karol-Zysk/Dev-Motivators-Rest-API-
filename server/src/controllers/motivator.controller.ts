import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app.error";
import Motivator, { MotivatorDocument, Place } from "../models/motivator.model";
import { APIFeatures } from "../utils/apiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { getMotivators } from "./handler.factory";
import  { isValidObjectId } from "mongoose";

export const createMotivator = catchAsync(
  async (req: Request, res: Response) => {
    const { title, subTitle, image }: MotivatorDocument = req.body;
    //Need to change this after testing !!!!
    const motivator = await Motivator.create({ title, subTitle, image });

    return res.send(motivator);
  }
);

export const getAllMotivators = catchAsync(
  async (req: Request, res: Response) => {
    const features = new APIFeatures(Motivator.find(), req.query)
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

export const getMotivatorsMain = getMotivators(Place.main);
export const getMotivatorsPurgatory = getMotivators(Place.purgatory);
export const getMotivatorsWaiting = getMotivators(Place.waiting);

export const getOneMotivator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const motivatorId = req.params.id;
    if (!isValidObjectId(motivatorId)) {
      return next(new AppError(404, "not valid Id"));
    }

    const motivator = await Motivator.findById(motivatorId);

    if (!motivator) {
      return next(new AppError(404, "There is no motivator with this id"));
    }
    res.status(200).json({
      status: "success",
      data: {
        motivator,
      },
    });
  }
);

export const updateOneMotivator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, subTitle, image }: MotivatorDocument = req.body;
    const motivatorId = req.params.id;
    const motivator = await Motivator.findByIdAndUpdate(
      motivatorId,
      { title, subTitle, image },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!motivator) {
      return next(new AppError(404, "There is no motivator with this Id"));
    }

    res.status(200).json({
      status: "success",
      data: {
        motivator,
      },
    });
  }
);

export const deleteOneMotivator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const motivatorId = req.params.id;
    const motivator = await Motivator.findByIdAndDelete(motivatorId);

    if (!motivator)
      return next(new AppError(404, "There is no motivator with this ID"));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const deleteAllMotivators = catchAsync(
  async (req: Request, res: Response) => {
    await Motivator.deleteMany({});

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
