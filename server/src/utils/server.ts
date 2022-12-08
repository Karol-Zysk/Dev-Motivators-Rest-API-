import express from "express";
import motivatorRouter from "../routes/motivator.router";
import userRouter from "../routes/user.router";

function createServer() {
  const app = express();

  app.use(express.json());
  app.use("/api/v1/motivators", motivatorRouter);
  app.use("/api/v1/users", userRouter);

  return app;
}

export default createServer;
