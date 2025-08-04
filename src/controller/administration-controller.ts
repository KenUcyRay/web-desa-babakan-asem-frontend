import { Request, Response, NextFunction } from "express";
import { UserRequest } from "@/type/user-request";
import { AdministrationService } from "@/service/administration-service";
import { I18nRequest } from "@/type/i18n-request";

export class AdministrationController {
  static async getPengantar(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await AdministrationService.getPengantar(req.query);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updatePengantar(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await AdministrationService.updatePengantar(
        req.t,
        req.params.id
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async pengantar(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdministrationService.pengantar(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
