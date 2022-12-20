import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app.error";
import Motivator, { MotivatorDocument, Place } from "../models/motivator.model";
import { APIFeatures } from "../utils/apiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { getMotivators } from "./handler.factory";
import { isValidObjectId } from "mongoose";

export const createMotivator = catchAsync(
  async (req: Request, res: Response) => {
    const { title, subTitle, image, author, keyWords }: MotivatorDocument =
      req.body;
    //Need to change this after testing !!!!
    const motivator = await Motivator.create({
      title,
      subTitle,
      image,
      author,
      keyWords,
    });

    return res.status(201).json(motivator);
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

export const getMotivator = catchAsync(
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

export const updateMotivator = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const motivatorId = req.params.id;

    //IF CURRENT USER IS AUTHOR THEN LET HIM UPDATE
    const { title, subTitle, image }: MotivatorDocument = req.body;

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

export const deleteMotivator = catchAsync(
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

export const giveThumbUp = catchAsync(async (req: Request, res: Response) => {
  Motivator.findByIdAndUpdate(req.params.id, {
    $push: { thumbUp: String(res.locals.user.id) },
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

export enum VoteKind {
  thumbUp = "thumbUp",
  thumbDown = "thumbDown",
}
export enum VoteMethod {
  give = "push",
  take = "pull",
}

export const vote = (option: VoteKind, method: string) =>
  catchAsync(async (req: Request, res: Response) => {
    const motivator = await Motivator.findByIdAndUpdate(
      req.params.id,
      {
        [`$${method}`]: { [`${option}`]: String(res.locals.user.id) },
        movedToMain: Date.now(),
      },
      { new: true, runValidators: true }
    );
    //
    if (motivator && motivator.thumbUp.length === 2) {
      await Motivator.findByIdAndUpdate(
        req.params.id,
        { place: Place.main },
        { new: true, runValidators: true }
      );
    }
    res.status(200).json({ motivator });
  });

export const accept = (place: Place) =>
  catchAsync(async (req: Request, res: Response) => {
    const motivatorId = req.params.id;
    const motivator = await Motivator.findByIdAndUpdate(
      motivatorId,
      { place: `${place}`, accepted: Date.now() },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Motivator moved out from 'Waiting'", motivator });
  });

export const getMotivatorsMain = getMotivators(Place.main);
export const getMotivatorsPurgatory = getMotivators(Place.purgatory);
export const getMotivatorsWaiting = getMotivators(Place.waiting);
