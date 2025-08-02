import { roleMiddleware } from "@/middleware/role-middleware";
import { Role } from "@prisma/client";
import express from "express";
export const pkkRouter = express.Router();

pkkRouter.use(roleMiddleware(Role.PKK));
