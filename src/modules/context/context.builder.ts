import { CharacterDocument } from "../characters/character.model";
import { WorldDocument } from "../worlds/world.model";
import { LLMMessage, LLMRequest } from "../llm/llm.types";
import { promptManager } from "./prompt.manager";

// ponytail: fixed-count message window for MVP; swap for token-counted budget + summary once conversations run long
const RECENT_MESSAGE_LIMIT = 20;

const MAX_TOKENS_BY_SENTENCE_LENGTH: Record<string, number> = { short: 80, medium: 200, long: 400 };

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export const contextBuilder = {
  build(params: {
    character: CharacterDocument;
    world: WorldDocument | null;
    currentScene: string;
    recentMessages: ConversationMessage[];
    userMessage: string;
  }): LLMRequest {
    const systemPrompt = promptManager.buildSystemPrompt(params.character, params.world, params.currentScene);

    const history: LLMMessage[] = params.recentMessages.slice(-RECENT_MESSAGE_LIMIT).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const sentenceLength = params.character.communicationStyle?.sentenceLength ?? "medium";

    return {
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: params.userMessage },
      ],
      stop: ["\n# HUMAN", "\nHUMAN:", "\n## AIBOT", "\nAIBOT:", "\nUser:", `\n${params.character.name}:`],
      maxTokens: MAX_TOKENS_BY_SENTENCE_LENGTH[sentenceLength] ?? MAX_TOKENS_BY_SENTENCE_LENGTH.medium,
    };
  },
};
