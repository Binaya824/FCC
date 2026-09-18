import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { logger } from "./infrastructure/logging/logger";
import { openApiSpec } from "./config/openapi";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import { characterRoutes } from "./modules/characters/character.routes";
import { worldRoutes } from "./modules/worlds/world.routes";
import { conversationRoutes } from "./modules/conversations/conversation.routes";

export function createApp() {
  const app = express();

  // Mounted before helmet() so its default CSP doesn't block Swagger UI's inline assets.
  app.get("/api-docs.json", (_req, res) => res.json(openApiSpec));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/v1/characters", characterRoutes);
  app.use("/api/v1/worlds", worldRoutes);
  app.use("/api/v1/conversations", conversationRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
