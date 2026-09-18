import { Schema, model, Types, InferSchemaType } from "mongoose";

const conversationSchema = new Schema(
  {
    characterId: { type: Schema.Types.ObjectId, ref: "Character", required: true },
    worldId: { type: Schema.Types.ObjectId, ref: "World" },
    title: { type: String, default: "" },
    currentScene: { type: String, default: "" },
  },
  { timestamps: true }
);

export type ConversationDocument = InferSchemaType<typeof conversationSchema> & { _id: Types.ObjectId };

export const ConversationModel = model("Conversation", conversationSchema);
