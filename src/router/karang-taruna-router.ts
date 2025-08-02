import { roleMiddleware } from "@/middleware/role-middleware";
import { Role } from "@prisma/client";
import express from "express";
export const karangTarunaRouter = express.Router();

karangTarunaRouter.use(roleMiddleware(Role.KARANG_TARUNA));
