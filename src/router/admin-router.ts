import { Role } from "@prisma/client";
import { VillageWorkProgramController } from "@/controller/village-work-program-controller";
import { roleMiddleware } from "@/middleware/role-middleware";
import express from "express";
import { VillageAchievementController } from "@/controller/village-achievement-controller";
import { upload } from "@/application/multer";
import { ResidentController } from "@/controller/resident-controller";
import { authMiddleware } from "@/middleware/auth-middleware";
import { ApbController } from "@/controller/apb-controller";
import { MessageController } from "@/controller/message-controller";
import { AdministrationController } from "@/controller/administration-controller";
import { GaleriController } from "@/controller/galeri-controller";
import { NewsController } from "@/controller/news-controller";
import { PkkController } from "@/controller/pkk-controller";
import { MemberController } from "@/controller/member-controller";
import { InfografisController } from "@/controller/infografis-controller";
import { AgendaController } from "@/controller/agenda-controller";
import { CategoryController } from "@/controller/category-controller";
import { ProductController } from "@/controller/product-controller";
import { UserController } from "@/controller/user-controller";

export const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware(Role.ADMIN));

// Users
adminRouter.get("/users", UserController.getAllUser);
adminRouter.post("/users", UserController.createUser);
adminRouter.patch("/users/:id", UserController.updateRole);

// Messages
adminRouter.get("/messages", MessageController.getAll);
adminRouter.patch("/messages/:id", MessageController.update);

// Administration
adminRouter.get("/administrations", AdministrationController.getPengantar);
adminRouter.patch(
  "/administrations/:id",
  AdministrationController.updatePengantar
);

// News
adminRouter.get("/news", NewsController.getOwn);
adminRouter.post(
  "/news",
  upload.single("featured_image"),
  NewsController.create
);
adminRouter.patch(
  "/news/:newsId",
  upload.single("featured_image"),
  NewsController.update
);
adminRouter.delete("/news/:newsId", NewsController.delete);

// adminRouter.use("/messages", messageAdminRouter);
// adminRouter.use("/administrasi", adminRouter);

// Admin routes for village work programs
adminRouter.post("/village-work-programs", VillageWorkProgramController.create);
adminRouter.patch(
  "/village-work-programs/:villageWorkProgramId",
  VillageWorkProgramController.update
);
adminRouter.delete(
  "/village-work-programs/:villageWorkProgramId",
  VillageWorkProgramController.delete
);

adminRouter.post(
  "/village-achievements",
  upload.single("featured_image"),
  VillageAchievementController.create
);
adminRouter.patch(
  "/village-achievements/:id",
  upload.single("featured_image"),
  VillageAchievementController.update
);
adminRouter.delete(
  "/village-achievements/:id",
  VillageAchievementController.delete
);

adminRouter.patch("/residents/:id", ResidentController.update);

adminRouter.post("/apb", ApbController.create);
adminRouter.patch("/apb/:id", ApbController.update);
adminRouter.delete("/apb/:id", ApbController.delete);

//Galeri
adminRouter.post("/galeri", upload.single("image"), GaleriController.create);
adminRouter.put(
  "/galeri/:galeriId",
  upload.single("image"),
  GaleriController.update
);
adminRouter.delete("/galeri/:galeriId", GaleriController.delete);

//Program PKK
adminRouter.post(
  "/programs",
  upload.single("featured_image"),
  PkkController.create
);
adminRouter.patch(
  "/programs/:programId",
  upload.single("featured_image"),
  PkkController.update
);
adminRouter.delete("/programs/:programId", PkkController.delete);

// Organization
adminRouter.post(
  "/organizations/members",
  upload.single("profile_photo"),
  MemberController.createMember
);
adminRouter.patch(
  "/organizations/members/:memberId",
  upload.single("profile_photo"),
  MemberController.updateMember
);
adminRouter.delete(
  "/organizations/members/:memberId",
  MemberController.deleteMember
);

adminRouter.get("/organizations/members", MemberController.getAllMembers);

// Infografis
adminRouter.post("/infografis/idm/", InfografisController.createIdm);
adminRouter.patch("/infografis/idm/:idmId", InfografisController.updateIdm);
adminRouter.delete("/infografis/idm/:idmId", InfografisController.deleteIdm);
adminRouter.post("/infografis/bansos/", InfografisController.createBansos);
adminRouter.patch(
  "/infografis/bansos/:bansosId",
  InfografisController.updateBansos
);
adminRouter.delete(
  "/infografis/bansos/:bansosId",
  InfografisController.deleteBansos
);
adminRouter.patch("/infografis/sdg/:sdgId", InfografisController.updateSdgs);

adminRouter.patch(
  "/infografis/extra-idm/:id",
  InfografisController.updateExtraIdm
);

// Agenda
adminRouter.get("/agenda/me", AgendaController.getOwn);
adminRouter.post(
  "/agenda/create",
  upload.single("featured_image"),
  AgendaController.create
);
adminRouter.patch(
  "/agenda/update-by-agenda/:agendaId",
  upload.single("featured_image"),
  AgendaController.update
);
adminRouter.delete(
  "/agenda/delete-by-agenda/:agendaId",
  AgendaController.delete
);

// Products

adminRouter.get("/products/categories", CategoryController.getCategories);
adminRouter.post("/products/categories", CategoryController.createCategory);
adminRouter.put(
  "/products/categories/:categoryId",
  CategoryController.updateCategory
);
adminRouter.delete(
  "/products/categories/:categoryId",
  CategoryController.deleteCategory
);

adminRouter.get("/products/me", ProductController.getOwn);
adminRouter.post(
  "/products/create",
  upload.single("featured_image"),
  ProductController.create
);
adminRouter.patch(
  "/products/update-by-product/:productId",
  upload.single("featured_image"),
  ProductController.update
);
adminRouter.delete(
  "/products/delete-by-product/:productId",
  ProductController.delete
);
