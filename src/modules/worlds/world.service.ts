import { z } from "zod";
import { worldRepository } from "./world.repository";
import { createWorldSchema, updateWorldSchema } from "./world.schema";
import { ApiError } from "../../utils/api-error";

type CreateWorldInput = z.infer<typeof createWorldSchema>;
type UpdateWorldInput = z.infer<typeof updateWorldSchema>;

export const worldService = {
  create(input: CreateWorldInput) {
    return worldRepository.create(input);
  },
  list() {
    return worldRepository.findAll();
  },
  async getById(id: string) {
    const world = await worldRepository.findById(id);
    if (!world) throw ApiError.notFound("World not found");
    return world;
  },
  async update(id: string, input: UpdateWorldInput) {
    const world = await worldRepository.updateById(id, input);
    if (!world) throw ApiError.notFound("World not found");
    return world;
  },
  async remove(id: string) {
    const world = await worldRepository.deleteById(id);
    if (!world) throw ApiError.notFound("World not found");
  },
};
