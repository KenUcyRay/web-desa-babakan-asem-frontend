import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { I18nRequest } from "../type/i18n-request";
import { CategoryService } from "../service/category-service";

export class CategoryController {
  static async getCategories(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await CategoryService.getCategories();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async createCategory(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await CategoryService.createCategory(req.t, req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async updateCategory(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await CategoryService.updateCategory(
        req.t,
        req.params.categoryId,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async deleteCategory(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CategoryService.deleteCategory(req.t, req.params.categoryId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
