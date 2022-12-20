import dotenv from "dotenv";
import log from "./utils/logger";
import connectDB from "./db/connection";
import errorMiddleware from "./middleware/error.middleware";
import createServer from "./utils/server";
import { NextFunction, Request, Response } from "express";
import { AppError } from "./utils/app.error";

dotenv.config({ path: "config.env" });

const port = process.env.PORT || 4001;

const app = createServer();

app.listen(port, async () => {
  log.info(`${process.env.WELCOME} App listening on port ${port}`);
  await connectDB();
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(errorMiddleware);
