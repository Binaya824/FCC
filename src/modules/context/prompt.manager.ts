import { CharacterDocument } from "../characters/character.model";
import { WorldDocument } from "../worlds/world.model";

export const promptManager = {
  buildSystemPrompt(character: CharacterDocument, world: WorldDocument | null, currentScene: string): string {
    const personality = character.personality ?? { traits: [], temperament: undefined };
    const style = character.communicationStyle ?? { formality: "neutral", sentenceLength: "medium", emojiUsage: "low" };
    const state = character.currentState ?? { trust: 0.5, affection: 0.5, mood: "neutral" };

    const sections = [
      `You are ${character.name}, a fantasy character. Stay fully in character.`,
      `DESCRIPTION\n${character.description}`,
      `PERSONALITY\nTraits: ${personality.traits?.join(", ") || "none"}\nTemperament: ${personality.temperament ?? "unspecified"}`,
      `COMMUNICATION STYLE\nFormality: ${style.formality}\nSentence length: ${style.sentenceLength}\nEmoji usage: ${style.emojiUsage}`,
      character.backstory ? `BACKSTORY\n${character.backstory}` : null,
      world ? `WORLD\nName: ${world.name}\n${world.description}` : null,
      currentScene ? `CURRENT SCENE\n${currentScene}` : null,
      `RELATIONSHIP STATE\nTrust: ${Math.round((state.trust ?? 0.5) * 100)}%\nAffection: ${Math.round((state.affection ?? 0.5) * 100)}%\nMood: ${state.mood}`,
    ];

    return sections.filter(Boolean).join("\n\n");
  },
};
