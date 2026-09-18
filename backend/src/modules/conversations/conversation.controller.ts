import { Request, Response } from "express";
import { conversationService } from "./conversation.service";

export const conversationController = {
  async create(req: Request, res: Response) {
    const conversation = await conversationService.create(req.body);
    res.status(201).json(conversation);
  },
  async list(_req: Request, res: Response) {
    const conversations = await conversationService.list();
    res.json(conversations);
  },
  async getById(req: Request, res: Response) {
    const conversation = await conversationService.getById(req.params.id);
    res.json(conversation);
  },
  async remove(req: Request, res: Response) {
    await conversationService.remove(req.params.id);
    res.status(204).send();
  },
  async getMessages(req: Request, res: Response) {
    const messages = await conversationService.getMessages(req.params.id);
    res.json(messages);
  },
  async sendMessage(req: Request, res: Response) {
    const result = await conversationService.sendMessage(req.params.id, req.body.message);
    res.status(201).json(result);
  },
};
