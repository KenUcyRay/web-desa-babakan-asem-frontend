import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { RatingService } from "../service/rating-service";

export class RatingController {
  static async alreadyRated(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await RatingService.alreadyRated(
        req.params.productId,
        req.user!
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createRating(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await RatingService.createRating(
        req.body,
        req.params.productId,
        req.user!
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateRating(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await RatingService.updateRating(
        req.params.ratingId,
        req.body,
        req.user!
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRating(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await RatingService.deleteRating(req.params.ratingId, req.user!);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
