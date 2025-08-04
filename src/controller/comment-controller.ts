import { Request, Response, NextFunction } from "express";
import { CommentService } from "../service/comment-service";
import { UserRequest } from "@/type/user-request";

export class CommentController {
  static async getByTargetId(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Fetching comments for target ID:", req.params.targetId);
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

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await CommentService.create(
        req.body,
        req.params.targetId,
        req.user!
      );
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await CommentService.update(
        req.body,
        req.params.commentId,
        req.user!
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await CommentService.delete(
        req.params.commentId,
        req.user!
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
