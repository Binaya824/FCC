import { z } from "zod";

export const createWorldSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  lore: z.string().max(20000).default(""),
  locations: z.array(z.string()).default([]),
  factions: z.array(z.string()).default([]),
  events: z.array(z.string()).default([]),
});

export const updateWorldSchema = createWorldSchema.partial();
