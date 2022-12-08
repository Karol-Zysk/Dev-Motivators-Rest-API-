import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";

const signToken = (id: string) =>
  jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRE_TIME}`,
  });

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  res.cookie("jwt", token);
  //Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { login, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
      login,
      email,
      password,
      passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  }
);
