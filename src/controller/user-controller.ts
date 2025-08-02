import { UserService } from "@/service/user-service";
import { UserRequest } from "@/type/user-request";
import { Request, Response, NextFunction } from "express";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.register(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.login(req.t, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.forgotPassword(req.body);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async verifyResetToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.verifyResetToken(req.query.token as string);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.resetPassword(req.body, req.query.token as string);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.getById(req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.getUser(req.user!);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.update(req.user!, req.body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await UserService.delete(req.user!, req.header("Authorization")!);
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async getAllUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const users = await UserService.getAllUser(page, limit);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  static async createUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.createUser(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async updateRole(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateRole(
        req.params.userId,
        req.body.role
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
