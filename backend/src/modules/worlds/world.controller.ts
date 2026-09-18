import { Request, Response } from "express";
import { worldService } from "./world.service";

export const worldController = {
  async create(req: Request, res: Response) {
    const world = await worldService.create(req.body);
    res.status(201).json(world);
  },
  async list(_req: Request, res: Response) {
    const worlds = await worldService.list();
    res.json(worlds);
  },
  async getById(req: Request, res: Response) {
    const world = await worldService.getById(req.params.id);
    res.json(world);
  },
  async update(req: Request, res: Response) {
    const world = await worldService.update(req.params.id, req.body);
    res.json(world);
  },
  async remove(req: Request, res: Response) {
    await worldService.remove(req.params.id);
    res.status(204).send();
  },
};
