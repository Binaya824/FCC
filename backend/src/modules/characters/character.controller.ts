import { Request, Response } from "express";
import { characterService } from "./character.service";

export const characterController = {
  async create(req: Request, res: Response) {
    const character = await characterService.create(req.body);
    res.status(201).json(character);
  },
  async list(_req: Request, res: Response) {
    const characters = await characterService.list();
    res.json(characters);
  },
  async getById(req: Request, res: Response) {
    const character = await characterService.getById(req.params.id);
    res.json(character);
  },
  async update(req: Request, res: Response) {
    const character = await characterService.update(req.params.id, req.body);
    res.json(character);
  },
  async remove(req: Request, res: Response) {
    await characterService.remove(req.params.id);
    res.status(204).send();
  },
};
