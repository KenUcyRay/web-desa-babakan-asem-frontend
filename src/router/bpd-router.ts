import { roleMiddleware } from "@/middleware/role-middleware";
import { Role } from "@prisma/client";
import express from "express";
export const bpdRouter = express.Router();

bpdRouter.use(roleMiddleware(Role.BPD));
