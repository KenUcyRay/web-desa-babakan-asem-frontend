import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { MemberService } from "../service/member-service";
import { Organization } from "@prisma/client";

export class MemberController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let organizationType: Organization | undefined = req.query
        .organizationType as Organization | undefined;
      if (req.query.organizationType === Organization.DPD) {
        organizationType = Organization.DPD;
      } else if (req.query.organizationType === Organization.KARANG_TARUNA) {
        organizationType = Organization.KARANG_TARUNA;
      } else if (req.query.organizationType === Organization.PEMERINTAH) {
        organizationType = Organization.PEMERINTAH;
      } else if (req.query.organizationType === Organization.PKK) {
        organizationType = Organization.PKK;
      } else if (req.query.organizationType === Organization.BPD) {
        organizationType = Organization.BPD;
      } else {
        organizationType = undefined;
      }
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await MemberService.getAll(
        organizationType,
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllMembers(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let organizationType: Organization | undefined = req.query
        .organizationType as Organization | undefined;
      if (req.query.organizationType === Organization.DPD) {
        organizationType = Organization.DPD;
      } else if (req.query.organizationType === Organization.KARANG_TARUNA) {
        organizationType = Organization.KARANG_TARUNA;
      } else if (req.query.organizationType === Organization.PEMERINTAH) {
        organizationType = Organization.PEMERINTAH;
      } else if (req.query.organizationType === Organization.PKK) {
        organizationType = Organization.PKK;
      } else if (req.query.organizationType === Organization.BPD) {
        organizationType = Organization.BPD;
      } else {
        organizationType = undefined;
      }
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await MemberService.getAllMembers(
        organizationType,
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async createMember(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await MemberService.createMember(req.body, req.file);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateMember(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await MemberService.updateMember(
        req.body,
        req.params.memberId,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMember(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await MemberService.deleteMember(req.params.memberId);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
