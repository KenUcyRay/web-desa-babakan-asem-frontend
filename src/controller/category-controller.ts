import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
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
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await CategoryService.createCategory(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async updateCategory(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await CategoryService.updateCategory(
        req.params.categoryId,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async deleteCategory(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CategoryService.deleteCategory(req.params.categoryId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
