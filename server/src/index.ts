import dotenv from "dotenv";
import log from "./utils/logger";
import connectDB from "./db/connection";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware";
import createServer from "./utils/server";

dotenv.config({ path: "config.env" });

const port = process.env.PORT || 4000;

const app = createServer();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "elo",
  });
});

app.listen(port, async () => {
  log.info(`${process.env.WELCOME} App listening on port ${port}`);
  await connectDB();
});

app.use(errorMiddleware);
