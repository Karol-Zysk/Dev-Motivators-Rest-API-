import log from "../utils/logger";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
import mongoose from "mongoose";

const uri = `${process.env.DB_URI}`;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    log.info("DB connected");
  } catch (e: any) {
    log.info(e);
  }
}

export default connectDB;
