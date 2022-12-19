import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { AppError } from "../utils/app.error";
import { catchAsync } from "../utils/catchAsync";
import { createSendToken, verifyJwt } from "../utils/jwt.utils";
import { CurrentUser } from "../interfaces/currentUser.interface";
import { Role } from "../models/user.model";

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const { login, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    login,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, "Please provide email and password"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError(401, "incorrect email or password"));
    }

    createSendToken(user, 200, res);
  }
);

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.cookies.jwt) {
      //verify token
      const { decoded } = verifyJwt(req.cookies.jwt);

      const currentUser = await User.findById((<CurrentUser>decoded).id);
      if (!currentUser) {
        return next();
      }
      //set promise to variable to return only boolean value
      const isPasswordChanged = await currentUser.changedPassword(
        (<CurrentUser>decoded).iat
      );

      if (isPasswordChanged) {
        return next();
      }
      //GRANT ACCESS TO PROTECTED ROUTE
      //SET USER DATA TO USE IN MIDDLEWARE
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  return next();
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //Check if there is token

    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new AppError(401, "You are not logged in"));
    }

    //validate token

    const { decoded } = verifyJwt(token);

    const currentUser = await User.findById((<CurrentUser>decoded).id);
    if (!currentUser) {
      return next(
        new AppError(401, "user belonging to this token no longer exists")
      );
    }
    //set promise to variable to return only boolean value
    const isPasswordChanged = await currentUser.changedPassword(
      (<CurrentUser>decoded).iat
    );

    if (isPasswordChanged) {
      return next(
        new AppError(401, "User recently changed password, please log in again")
      );
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    //SET USER DATA TO USE IN MIDDLEWARE
    res.locals.user = currentUser;

    next();
  }
);

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //CHECK IF USER HAS THE ROLE
    if (!roles.includes(res.locals.user.role)) {
      return next(new AppError(403, "You do not have permission to do this"));
    }
    next();
  };
};

export const profile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers["x-access-token"];
  console.log(token);

  let user;
  if (token) {
    user = verifyJwt(token as string);
  }

  // Return the user's profile
  res.json({ user });
});
