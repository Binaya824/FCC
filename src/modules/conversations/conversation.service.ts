import { z } from "zod";
import { conversationRepository, messageRepository } from "./conversation.repository";
import { createConversationSchema } from "./conversation.schema";
import { characterRepository } from "../characters/character.repository";
import { worldRepository } from "../worlds/world.repository";
import { contextBuilder } from "../context/context.builder";
import { llmGateway } from "../llm/llm.gateway";
import { ApiError } from "../../utils/api-error";

type CreateConversationInput = z.infer<typeof createConversationSchema>;

export const conversationService = {
  async create(input: CreateConversationInput) {
    const character = await characterRepository.findById(input.characterId);
    if (!character) throw ApiError.badRequest("Character not found");

    if (input.worldId) {
      const world = await worldRepository.findById(input.worldId);
      if (!world) throw ApiError.badRequest("World not found");
    }

    return conversationRepository.create({
      characterId: character._id,
      worldId: input.worldId,
      title: input.title ?? `Chat with ${character.name}`,
    });
  },

  list() {
    return conversationRepository.findAll();
  },

  async getById(id: string) {
    const conversation = await conversationRepository.findById(id);
    if (!conversation) throw ApiError.notFound("Conversation not found");
    return conversation;
  },

  async remove(id: string) {
    const conversation = await conversationRepository.findById(id);
    if (!conversation) throw ApiError.notFound("Conversation not found");
    await messageRepository.deleteByConversationId(id);
    await conversationRepository.deleteById(id);
  },

  async getMessages(conversationId: string) {
    await this.getById(conversationId);
    return messageRepository.findByConversationId(conversationId);
  },

  async sendMessage(conversationId: string, userMessage: string) {
    const conversation = await this.getById(conversationId);
    const character = await characterRepository.findById(conversation.characterId.toString());
    if (!character) throw ApiError.notFound("Character not found");

    const world = conversation.worldId ? await worldRepository.findById(conversation.worldId.toString()) : null;
    const recentMessages = await messageRepository.findByConversationId(conversationId);

    const llmRequest = contextBuilder.build({
      character,
      world,
      currentScene: conversation.currentScene ?? "",
      recentMessages: recentMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      userMessage,
    });

    const llmResponse = await llmGateway.generate(llmRequest);

    await messageRepository.create({ conversationId, role: "user", content: userMessage });
    const assistantMessage = await messageRepository.create({
      conversationId,
      role: "assistant",
      content: llmResponse.content,
      tokenUsage: llmResponse.usage,
      model: llmResponse.model,
    });

    return { message: assistantMessage, usage: llmResponse.usage };
  },
};
