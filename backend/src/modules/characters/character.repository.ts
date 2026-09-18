import { CharacterModel } from "./character.model";

export const characterRepository = {
  create(data: Record<string, unknown>) {
    return CharacterModel.create(data);
  },
  findAll() {
    return CharacterModel.find().sort({ createdAt: -1 }).exec();
  },
  findById(id: string) {
    return CharacterModel.findById(id).exec();
  },
  updateById(id: string, data: Record<string, unknown>) {
    return CharacterModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  },
  deleteById(id: string) {
    return CharacterModel.findByIdAndDelete(id).exec();
  },
};
