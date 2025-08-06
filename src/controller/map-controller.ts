import { MapService } from './../service/map-service';
import { UserRequest } from "@/type/user-request";
import { Response, NextFunction } from "express";

export class MapController {
  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      // Call the service to get regions
      const response = await MapService.get();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
