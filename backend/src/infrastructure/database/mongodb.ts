import mongoose from "mongoose";
import { env } from "../../config/env";
import { logger } from "../logging/logger";

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB connection error"));

  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB");
}
