import { roleMiddleware } from "@/middleware/role-middleware";
import { Role } from "@prisma/client";
import express from "express";

export const contributorRouter = express.Router();

contributorRouter.use(roleMiddleware(Role.CONTRIBUTOR));
