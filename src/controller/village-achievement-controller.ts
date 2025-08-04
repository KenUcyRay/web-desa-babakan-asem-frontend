import { VillageAchievementService } from "@/service/village-achievement-service";
import { Request, Response, NextFunction } from "express";
import { I18nRequest } from "@/type/i18n-request";

export class VillageAchievementController {
  //Public
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.getAll();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async get(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.get(
        req.t,
        req.params.villageAchievementsId
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Admin
  static async create(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.create(
        req.t,
        req.body,
        req.file
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.update(
        req.t,
        req.body,
        req.params.id,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      await VillageAchievementService.delete(req.t, req.params.id);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
