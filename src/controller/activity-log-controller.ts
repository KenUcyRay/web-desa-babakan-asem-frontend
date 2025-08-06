import { ActivityLogService } from "@/service/activity-log-service";
import { UserRequest } from "@/type/user-request";
import { Response, NextFunction } from "express";

export class ActivityLogController {
  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ActivityLogService.getAll(req.query);
      res.status(200).json(response); 
    } catch (error) {
      next(error);
    }
  }
}
