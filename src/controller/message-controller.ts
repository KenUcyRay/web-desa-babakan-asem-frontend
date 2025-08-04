import { Request, Response, NextFunction } from "express";
import {
  CreateMessageRequest,
  QueryMessageRequest,
} from "@/model/message-model";
import { MessageService } from "@/service/message-service";
import { I18nRequest } from "@/type/i18n-request";

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
      const response = await MessageService.getAll(
        req.query as QueryMessageRequest
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await MessageService.update(req.t, req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
