import { Response } from "express";
import { UserDocument } from "../models/user.model";
import jwt from "jsonwebtoken";

const signToken = (id: string) =>
  jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRE_TIME}`,
  });

export const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(`${process.env.JWT_COOKIE_EXPIRES_IN}`) * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: false,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
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

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
