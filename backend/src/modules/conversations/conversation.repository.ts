import { ConversationModel } from "./conversation.model";
import { MessageModel } from "./message.model";

export const conversationRepository = {
  create(data: Record<string, unknown>) {
    return ConversationModel.create(data);
  },
  findAll() {
    return ConversationModel.find().sort({ createdAt: -1 }).exec();
  },
  findById(id: string) {
    return ConversationModel.findById(id).exec();
  },
  deleteById(id: string) {
    return ConversationModel.findByIdAndDelete(id).exec();
  },
  updateScene(id: string, currentScene: string) {
    return ConversationModel.findByIdAndUpdate(id, { currentScene }, { new: true }).exec();
  },
};

export const messageRepository = {
  create(data: {
    conversationId: string;
    role: "user" | "assistant" | "system";
    content: string;
    tokenUsage?: { inputTokens: number; outputTokens: number; totalTokens: number };
    model?: string;
  }) {
    return MessageModel.create(data);
  },
  findByConversationId(conversationId: string, limit = 50) {
    return MessageModel.find({ conversationId }).sort({ createdAt: 1 }).limit(limit).exec();
  },
  deleteByConversationId(conversationId: string) {
    return MessageModel.deleteMany({ conversationId }).exec();
  },
};
