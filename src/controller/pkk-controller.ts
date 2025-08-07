import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { PkkService } from "../service/pkk-service";
import { I18nRequest } from "../type/i18n-request";

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

  static async create(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await PkkService.create(
        req.t,
        req.body,
        req.user!,
        req.file
      );
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
      const response = await PkkService.update(
        req.t,
        req.body,
        req.params.programId,
        req.user!,
        req.file
      );
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
      await PkkService.delete(req.t, req.params.programId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
