import { roleMiddleware } from "@/middleware/role-middleware";
import { Role } from "@prisma/client";
import express from "express";
export const bumdesRouter = express.Router();

bumdesRouter.use(roleMiddleware(Role.BUMDES));
