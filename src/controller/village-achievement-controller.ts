import { VillageAchievementService } from "@/service/village-achievement-service";
import { Request, Response, NextFunction } from "express";

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
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.get(
        req.params.villageAchievementsId
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Admin
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.create(
        req.body,
        req.file
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await VillageAchievementService.update(
        req.body,
        req.params.id,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await VillageAchievementService.delete(req.params.id);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
