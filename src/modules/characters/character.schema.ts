import { z } from "zod";

const personalitySchema = z.object({
  traits: z.array(z.string()).default([]),
  temperament: z.string().optional(),
  values: z.array(z.string()).default([]),
  behavioralPatterns: z.array(z.string()).default([]),
});

const communicationStyleSchema = z.object({
  formality: z.enum(["casual", "neutral", "formal"]).default("neutral"),
  sentenceLength: z.enum(["short", "medium", "long"]).default("medium"),
  vocabulary: z.string().optional(),
  emojiUsage: z.enum(["none", "low", "medium", "high"]).default("low"),
});

const currentStateSchema = z.object({
  mood: z.string().default("neutral"),
  trust: z.number().min(0).max(1).default(0.5),
  affection: z.number().min(0).max(1).default(0.5),
});

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  avatar: z.string().url().optional(),
  personality: personalitySchema.default({}),
  communicationStyle: communicationStyleSchema.default({}),
  backstory: z.string().max(10000).default(""),
  relationships: z.array(z.string()).default([]),
  speechPatterns: z.array(z.string()).default([]),
  currentState: currentStateSchema.default({}),
  worldId: z.string().optional(),
});

export const updateCharacterSchema = createCharacterSchema.partial();
