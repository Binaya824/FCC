import { Router } from "express";
import { conversationController } from "./conversation.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { createConversationSchema, sendMessageSchema } from "./conversation.schema";
import { asyncHandler } from "../../utils/async-handler";

export const conversationRoutes = Router();

conversationRoutes.get("/", asyncHandler(conversationController.list));
conversationRoutes.post("/", validateBody(createConversationSchema), asyncHandler(conversationController.create));
conversationRoutes.get("/:id", asyncHandler(conversationController.getById));
conversationRoutes.delete("/:id", asyncHandler(conversationController.remove));
conversationRoutes.get("/:id/messages", asyncHandler(conversationController.getMessages));
conversationRoutes.post(
  "/:id/messages",
  validateBody(sendMessageSchema),
  asyncHandler(conversationController.sendMessage)
);
