import { Request, Response, NextFunction } from "express";
import { CreateMessageRequest } from "@/model/message-model";
import { MessageService } from "@/service/message-service";

export class MessageController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateMessageRequest;
      const response = await MessageService.create(request);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      let isRead: boolean | undefined = undefined;
      if (typeof req.query.is_read !== "undefined") {
        if (req.query.is_read === "true") {
          isRead = true;
        } else if (req.query.is_read === "false") {
          isRead = false;
        }
      }
      if (isNaN(page)) {
        page = 1;
      }
      if (isNaN(limit)) {
        limit = 10;
      }
      const response = await MessageService.getAll(page, limit, isRead);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const response = await MessageService.update(messageId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      await MessageService.delete(messageId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
