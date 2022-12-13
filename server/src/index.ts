import dotenv from "dotenv";
import log from "./utils/logger";
import connectDB from "./db/connection";
import errorMiddleware from "./middleware/error.middleware";
import createServer from "./utils/server";

dotenv.config({ path: "config.env" });

const port = process.env.PORT || 4000;

const app = createServer();

app.listen(port, async () => {
  log.info(`${process.env.WELCOME} App listening on port ${port}`);
  await connectDB();
});

app.use(errorMiddleware);
