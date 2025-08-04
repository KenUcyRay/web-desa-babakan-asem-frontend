import express from "express";
import { UserController } from "@/controller/user-controller";
import { VillageWorkProgramController } from "@/controller/village-work-program-controller";
import { MessageController } from "@/controller/message-controller";
import { VillageAchievementController } from "@/controller/village-achievement-controller";
import { ResidentController } from "@/controller/resident-controller";
import { ApbController } from "@/controller/apb-controller";
import { AdministrationController } from "@/controller/administration-controller";
import { GaleriController } from "@/controller/galeri-controller";
import { NewsController } from "@/controller/news-controller";
import { PkkController } from "@/controller/pkk-controller";
import { MemberController } from "@/controller/member-controller";
import { InfografisController } from "@/controller/infografis-controller";
import { AgendaController } from "@/controller/agenda-controller";
import { ProductController } from "@/controller/product-controller";
import { CommentController } from "@/controller/comment-controller";

export const publicRouter = express.Router();

// Users
publicRouter.post("/users/register", UserController.register);
publicRouter.post("/users/login", UserController.login);
publicRouter.post("/users/forgot-password", UserController.forgotPassword);
publicRouter.post("/users/verify-reset-token", UserController.verifyResetToken);
publicRouter.post("/users/reset-password", UserController.resetPassword);

// Messages
publicRouter.post("/messages", MessageController.create);

//administration
publicRouter.post("/administrations", AdministrationController.pengantar);

//News
publicRouter.get("/news", NewsController.getAll);
publicRouter.get("/news/:userId", NewsController.getById);

// publicRouter.post("/administrations", AdministrationController.create);

// publicRouter.get("/agenda",)

// Public routes for village work programs
publicRouter.get("/village-work-programs", VillageWorkProgramController.getAll);

publicRouter.get("/village-achievements", VillageAchievementController.getAll);
publicRouter.get(
  "/village-achievements/:villageAchievementsId",
  VillageAchievementController.get
);

publicRouter.get("/residents", ResidentController.getAll);

publicRouter.get("/apb", ApbController.getAll);

//Galeri
publicRouter.get("/galeri", GaleriController.getAll);

//Pkk
publicRouter.get("/programs", PkkController.getAll);

//Organization
publicRouter.get("/organizations/members", MemberController.getAll);

//Infografis
publicRouter.get("/infografis/idm", InfografisController.getIdm);
publicRouter.get("/infografis/bansos", InfografisController.getBansos);
publicRouter.get("/infografis/sdg", InfografisController.getSdgs);

publicRouter.get("/infografis/extra-idm", InfografisController.getExtraIdm);

//Agenda
publicRouter.get("/agenda/", AgendaController.getAll);
publicRouter.get("/agenda/:agendaId", AgendaController.getById);

//Products
publicRouter.get("/products", ProductController.getAll);
publicRouter.get("/products/:userId", ProductController.getById);

//Comments
publicRouter.get("/comments/:targetId", CommentController.getByTargetId);
