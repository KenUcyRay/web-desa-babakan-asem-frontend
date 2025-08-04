import { Request, Response, NextFunction } from "express";
import { CommentService } from "../service/comment-service";
import { UserRequest } from "@/type/user-request";
import { I18nRequest } from "@/type/i18n-request";

export class CommentController {
  static async getByTargetId(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await CommentService.getByTargetId(
        req.params.targetId,
        page,
        limit
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
      const response = await CommentService.create(
        req.t,
        req.body,
        req.params.targetId,
        req.user!
      );
      return res.status(201).json(response);
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
      const response = await CommentService.update(
        req.t,
        req.body,
        req.params.commentId,
        req.user!
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
      const response = await CommentService.delete(
        req.t,
        req.params.commentId,
        req.user!
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
