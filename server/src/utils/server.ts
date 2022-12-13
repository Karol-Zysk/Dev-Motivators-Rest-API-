import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import motivatorRouter from "../routes/motivator.router";
import userRouter from "../routes/user.router";
import compression from "compression";
import hpp from "hpp";

function createServer() {
  const app = express();
  app.options("*", cors());
  app.use(helmet());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  const limiter = rateLimit({
    max: 30,
    windowMs: 5 * 60 * 1000,
    message: "Too many request from this IP, try again in 5 minutes!",
  });

  app.use("/api", limiter);

  app.use(express.json({ limit: "10kb" }));
  app.use(urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  //Data sanitization against NoSQL  data injection
  app.use(mongoSanitize());
  //Prevent parametr polution
  app.use(
    hpp({
      whitelist: [
        "duration",
        "ratingsAverage",
        "ratingsQuantity",
        "maxGroupSize",
        "price",
        "difficulty",
      ],
    })
  );
  app.use(compression());

  app.use("/api/v1/motivators", motivatorRouter);
  app.use("/api/v1/users", userRouter);

  return app;
}

export default createServer;
