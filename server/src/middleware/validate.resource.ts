import { NextFunction, Request, Response } from "express";
import * as Yup from "yup";

const formSchema = Yup.object({
  login: Yup.string()
    .required("Username required")
    .min(5, "Username too short")
    .max(20, "Username too long"),
  password: Yup.string()
    .required("Password required")
    .min(5, "Password too short")
    .max(20, "Password too long"),
});

export const validateForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .then((valid) => {
      if (valid) {
        return next();
      }
    })
    .catch((err) => {
      return res.status(422).send(err.errors);
    });
};
