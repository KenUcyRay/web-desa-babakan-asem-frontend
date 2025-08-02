import { ApbService } from "@/service/apb-service";
import { UserRequest } from "@/type/user-request";
import { Response, Request, NextFunction } from "express";

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

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ApbService.update(req.body, req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await ApbService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
