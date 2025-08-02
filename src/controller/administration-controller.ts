import { Request, Response, NextFunction } from "express";
import { UserRequest } from "@/type/user-request";
import { AdministrationService } from "@/service/administration-service";

export class AdministrationController {
  static async getPengantar(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      let isPending: boolean | null = null;
      if (req.query.isPending == "true") {
        isPending = true;
      } else if (req.query.isPending == "false") {
        isPending = false;
      }
      const response = await AdministrationService.getPengantar(
        page,
        limit,
        isPending
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updatePengantar(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await AdministrationService.updatePengantar(
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
