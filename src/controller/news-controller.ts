import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { I18nRequest } from "../type/i18n-request";
import { NewsService } from "../service/news-service";

export class NewsController {
  static async getOwn(req: UserRequest, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      let isPublished: boolean | undefined = undefined;
      if (typeof req.query.is_published !== "undefined") {
        if (req.query.is_published === "true") {
          isPublished = true;
        } else if (req.query.is_published === "false") {
          isPublished = true;
        }
      }
      if (isNaN(page)) {
        page = 1;
      }
      if (isNaN(limit)) {
        limit = 10;
      }
      const response = await NewsService.getOwn(
        req.user!,
        page,
        limit,
        isPublished
      );
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
      const response = await NewsService.create(
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
      if (req.body.is_published === "false") {
        req.body.is_published = false;
      } else if (req.body.is_published === "true") {
        req.body.is_published = true;
      }
      const response = await NewsService.update(
        req.t,
        req.body,
        req.user!,
        req.params.newsId,
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
      await NewsService.delete(
        req.t,
        req.params.newsId,
        req.user!,
        req.header("Authorization")!
      );
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await NewsService.getAll(page, limit);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getById(
    req: Request & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await NewsService.getById(req.t, req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
