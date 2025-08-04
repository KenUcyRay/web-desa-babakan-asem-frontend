import { Response, NextFunction } from "express";
import { ResponseError } from "@/error/response-error";
import { UserRequest } from "@/type/user-request";
import { toUserResponse, UserResponse } from "@/model/user-model";
import { prismaClient } from "../application/database";
import { verifyToken } from "@/util/jwt";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get token from cookies first
    let token = req.cookies.token;

    // If no cookie token, try Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log("🔑 Token found in Authorization header");
      }
    } else {
      console.log("🍪 Token found in cookies");
    }

    if (!token) {
      throw new ResponseError(401, "Unauthorized");
    }

    const userResponse = verifyToken(token) as UserResponse;
    const user = await prismaClient.user.findUnique({
      where: { id: userResponse.id },
    });

    if (!user) {
      throw new ResponseError(401, "Unauthorized");
    }

    req.user = toUserResponse(user);
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
