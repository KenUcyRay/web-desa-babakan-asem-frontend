import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { GaleriService } from "../service/galeri-service";

export class GaleriController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await GaleriService.create(req.body, req.file);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await GaleriService.update(
        req.params.galeriId,
        req.body,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await GaleriService.delete(req.params.galeriId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await GaleriService.getAll(page, limit);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
