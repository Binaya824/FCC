import { WorldModel } from "./world.model";

export const worldRepository = {
  create(data: Record<string, unknown>) {
    return WorldModel.create(data);
  },
  findAll() {
    return WorldModel.find().sort({ createdAt: -1 }).exec();
  },
  findById(id: string) {
    return WorldModel.findById(id).exec();
  },
  updateById(id: string, data: Record<string, unknown>) {
    return WorldModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  },
  deleteById(id: string) {
    return WorldModel.findByIdAndDelete(id).exec();
  },
};
