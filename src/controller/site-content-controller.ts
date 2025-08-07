import { SiteContentService } from "@/service/site-content-service";
import { I18nRequest } from "@/type/i18n-request";
import { UserRequest } from "@/type/user-request";
import { Request, Response, NextFunction } from "express";

export class SiteContentController {
  static async create(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await SiteContentService.create(
        req.t,
        req.body,
        req.file
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await SiteContentService.getAll(req.query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SiteContentService.getByKey(req.params.key);
      return res.status(200).json(response);
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
      const response = await SiteContentService.update(
        req.t,
        req.params.id,
        req.body,
        req.file
      );
      return res.status(200).json(response);
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
      const response = await SiteContentService.delete(req.params.id);
      return res.status(204).json(response);
    } catch (error) {
      next(error);
    }
  }
}
