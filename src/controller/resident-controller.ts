import { ResidentService } from "@/service/resident-service";
import { UserRequest } from "@/type/user-request";
import { Request, Response, NextFunction } from "express";

export class ResidentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ResidentService.getAll(req.query as any);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ResidentService.update(
        req.params.id,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
