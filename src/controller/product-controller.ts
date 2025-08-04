import { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/product-service";
import { UserRequest } from "@/type/user-request";
import { I18nRequest } from "@/type/i18n-request";

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await ProductService.getAll(page, limit);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await ProductService.getById(req.t, req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getOwn(req: UserRequest, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      if (isNaN(page)) {
        page = 1;
      }
      if (isNaN(limit)) {
        limit = 10;
      }
      const response = await ProductService.getOwn(req.user!, page, limit);
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
      const response = await ProductService.create(
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
      const response = await ProductService.update(
        req.t,
        req.body,
        req.user!,
        req.params.productId,
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
      await ProductService.delete(
        req.t,
        req.params.productId,
        req.user!,
        req.header("Authorization")!
      );
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
