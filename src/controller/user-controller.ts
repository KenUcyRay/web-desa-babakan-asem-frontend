import { QueryUser } from "@/model/user-model";
import { UserService } from "@/service/user-service";
import { UserRequest } from "@/type/user-request";
import { clearCookie, setCookie } from "@/util/cookie";
import { Request, Response, NextFunction } from "express";
import { TFunction } from "i18next";

// Extend Request interface to include i18n
interface RequestWithI18n extends Request {
  t: TFunction;
}

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.register(req.body);
      setCookie(res, response.token, req.body.remember_me);
      res.status(201).json({ data: response.user });
    } catch (error) {
      next(error);
    }
  }
  static async login(req: RequestWithI18n, res: Response, next: NextFunction) {
    try {
      console.log("🔍 Login request received from:", req.get("origin"));
      console.log("🔍 Request headers:", {
        origin: req.get("origin"),
        userAgent: req.get("user-agent"),
        acceptLanguage: req.get("accept-language"),
      });

      const response = await UserService.login(req.t, req.body);
      setCookie(res, response.token, req.body.remember_me);

      console.log("✅ Login successful, cookie set");
      console.log("🍪 Response headers will include Set-Cookie");

      // Include token in response for cross-origin testing
      res.status(200).json({
        data: {
          ...response.user,
          token: response.token, // Add token to response for header auth testing
        },
      });
    } catch (error) {
      console.log("❌ Login error:", error);
      next(error);
    }
  }
  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      clearCookie(res);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await UserService.delete(req.user!);
      clearCookie(res);
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async profile(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.profile(req.user!);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.update(req.user!, req.body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getAllUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUser(
        req.user!,
        req.query as QueryUser
      );
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  static async createUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.createUser(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async updateRole(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateRole(req.params.id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.forgotPassword(req.body);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async verifyResetToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.verifyResetToken(req.query.token as string);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.resetPassword(req.body, req.query.token as string);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
