import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { I18nRequest } from "../type/i18n-request";
import { RatingService } from "../service/rating-service";

export class RatingController {
  static async alreadyRated(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await RatingService.alreadyRated(
        req.t,
        req.params.productId,
        req.user!
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createRating(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await RatingService.createRating(
        req.t,
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
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await RatingService.updateRating(
        req.t,
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
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await RatingService.deleteRating(req.t, req.params.ratingId, req.user!);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
