import { ApbService } from "@/service/apb-service";
import { UserRequest } from "@/type/user-request";
import { Response, Request, NextFunction } from "express";
import { I18nRequest } from "@/type/i18n-request";

export class ApbController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ApbService.getAll();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ApbService.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ApbService.update(req.t, req.body, req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await ApbService.delete(req.t, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
