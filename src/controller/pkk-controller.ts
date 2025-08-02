import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { PkkService } from "../service/pkk-service";

export class PkkController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await PkkService.getAll(page, limit);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await PkkService.create(req.body, req.file);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await PkkService.update(
        req.body,
        req.params.programId,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await PkkService.delete(req.params.programId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
