import express from "express";
import dotenv from "dotenv";
import log from "./utils/logger";
import connectDB from "./db/connection";
import motivatorRouter from "./routes/motivator.router";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware";

dotenv.config({ path: "config.env" });

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/motivators", motivatorRouter);

connectDB();

app.listen(port, () => {
  log.info(`${process.env.WELCOME} App listening on port ${port}`);
});

app.use(errorMiddleware);
