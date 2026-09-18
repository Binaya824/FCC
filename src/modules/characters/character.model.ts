import { Schema, model, Types, InferSchemaType } from "mongoose";

const characterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    avatar: { type: String },
    personality: {
      traits: { type: [String], default: [] },
      temperament: { type: String },
      values: { type: [String], default: [] },
      behavioralPatterns: { type: [String], default: [] },
    },
    communicationStyle: {
      formality: { type: String, enum: ["casual", "neutral", "formal"], default: "neutral" },
      sentenceLength: { type: String, enum: ["short", "medium", "long"], default: "medium" },
      vocabulary: { type: String },
      emojiUsage: { type: String, enum: ["none", "low", "medium", "high"], default: "low" },
    },
    backstory: { type: String, default: "" },
    relationships: { type: [String], default: [] },
    speechPatterns: { type: [String], default: [] },
    currentState: {
      mood: { type: String, default: "neutral" },
      trust: { type: Number, default: 0.5, min: 0, max: 1 },
      affection: { type: Number, default: 0.5, min: 0, max: 1 },
    },
    worldId: { type: Schema.Types.ObjectId, ref: "World" },
  },
  { timestamps: true }
);

export type CharacterDocument = InferSchemaType<typeof characterSchema> & { _id: Types.ObjectId };

export const CharacterModel = model("Character", characterSchema);
