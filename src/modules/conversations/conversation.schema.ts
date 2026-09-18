import { z } from "zod";

export const createConversationSchema = z.object({
  characterId: z.string().min(1),
  worldId: z.string().optional(),
  title: z.string().max(200).optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1).max(4000),
});
