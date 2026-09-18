import { Router } from "express";
import { worldController } from "./world.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { createWorldSchema, updateWorldSchema } from "./world.schema";
import { asyncHandler } from "../../utils/async-handler";

export const worldRoutes = Router();

worldRoutes.get("/", asyncHandler(worldController.list));
worldRoutes.post("/", validateBody(createWorldSchema), asyncHandler(worldController.create));
worldRoutes.get("/:id", asyncHandler(worldController.getById));
worldRoutes.patch("/:id", validateBody(updateWorldSchema), asyncHandler(worldController.update));
worldRoutes.delete("/:id", asyncHandler(worldController.remove));
