import { Router } from "express";
import { characterController } from "./character.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { createCharacterSchema, updateCharacterSchema } from "./character.schema";
import { asyncHandler } from "../../utils/async-handler";

export const characterRoutes = Router();

characterRoutes.get("/", asyncHandler(characterController.list));
characterRoutes.post("/", validateBody(createCharacterSchema), asyncHandler(characterController.create));
characterRoutes.get("/:id", asyncHandler(characterController.getById));
characterRoutes.patch("/:id", validateBody(updateCharacterSchema), asyncHandler(characterController.update));
characterRoutes.delete("/:id", asyncHandler(characterController.remove));
