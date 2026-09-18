import { z } from "zod";
import { characterRepository } from "./character.repository";
import { createCharacterSchema, updateCharacterSchema } from "./character.schema";
import { ApiError } from "../../utils/api-error";

type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;

export const characterService = {
  create(input: CreateCharacterInput) {
    return characterRepository.create(input);
  },
  list() {
    return characterRepository.findAll();
  },
  async getById(id: string) {
    const character = await characterRepository.findById(id);
    if (!character) throw ApiError.notFound("Character not found");
    return character;
  },
  async update(id: string, input: UpdateCharacterInput) {
    const character = await characterRepository.updateById(id, input);
    if (!character) throw ApiError.notFound("Character not found");
    return character;
  },
  async remove(id: string) {
    const character = await characterRepository.deleteById(id);
    if (!character) throw ApiError.notFound("Character not found");
  },
};
