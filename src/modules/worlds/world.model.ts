import { Schema, model, Types, InferSchemaType } from "mongoose";

const worldSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    lore: { type: String, default: "" },
    locations: { type: [String], default: [] },
    factions: { type: [String], default: [] },
    events: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type WorldDocument = InferSchemaType<typeof worldSchema> & { _id: Types.ObjectId };

export const WorldModel = model("World", worldSchema);
