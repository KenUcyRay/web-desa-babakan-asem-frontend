import path from "path";
import fs from "fs/promises";
import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import {
  CreateVillageAchievementRequest,
  UpdateVillageAchievementRequest,
} from "@/model/village-achievement-model";
import { Validation } from "@/validation/validation";
import { VillageAchievementValidation } from "@/validation/village-achievement-validation";

export class VillageAchievementService {
  static async getAll() {
    const achievements = await prismaClient.villageAchievement.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return { data: achievements };
  }
  static async get(id: string) {
    const achievement = await prismaClient.villageAchievement.findUnique({
      where: {
        id: id,
      },
    });

    if (!achievement) {
      throw new ResponseError(404, "Village achievement not found");
    }

    return { data: achievement };
  }

  static async create(
    request: CreateVillageAchievementRequest,
    file?: Express.Multer.File
  ) {
    const validation = Validation.validate(
      VillageAchievementValidation.create,
      request
    );
    if (!file) {
      throw new ResponseError(400, "Featured image is required");
    }

    validation.featured_image = file.filename;

    const achievement = await prismaClient.villageAchievement.create({
      data: validation,
    });

    return { data: achievement };
  }

  static async update(
    request: UpdateVillageAchievementRequest,
    id: string,
    file?: Express.Multer.File
  ) {
    const achievement = await prismaClient.villageAchievement.findUnique({
      where: {
        id: id,
      },
    });
    if (!achievement) {
      throw new ResponseError(404, "Village achievement not found");
    }

    const validation = Validation.validate(
      VillageAchievementValidation.update,
      request
    );

    if (file) {
      validation.featured_image = file.filename;
    } else {
      validation.featured_image = undefined;
    }
    console.log(validation.featured_image);

    const achievementUpdate = await prismaClient.villageAchievement.update({
      where: {
        id: id,
      },
      data: validation,
    });
    
    if (file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        achievement.featured_image
      );

      await fs.unlink(filePath);
    }

    return { data: achievementUpdate };
  }

  static async delete(id: string) {
    const achievement = await prismaClient.villageAchievement.findUnique({
      where: {
        id: id,
      },
    });

    if (!achievement) {
      throw new ResponseError(404, "Village achievement not found");
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      achievement.featured_image
    );

    await fs.unlink(filePath);

    await prismaClient.villageAchievement.delete({
      where: {
        id: id,
      },
    });
  }
}
