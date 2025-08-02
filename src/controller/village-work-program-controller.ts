import { VillageWorkProgramService } from "@/service/village-work-program-service";
import { UserRequest } from "@/type/user-request";
import { Request, Response, NextFunction } from "express";

export class VillageWorkProgramController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await VillageWorkProgramService.getAll();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await VillageWorkProgramService.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await VillageWorkProgramService.update(
        req.params.villageWorkProgramId,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await VillageWorkProgramService.delete(req.params.villageWorkProgramId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
