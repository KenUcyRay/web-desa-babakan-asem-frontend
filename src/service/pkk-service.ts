import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validation/validation";
import path from "node:path";
import fs from "node:fs/promises";
import { PkkCreateRequest, PkkUpdateRequest } from "../model/pkk-model";
import { PkkValidation } from "../validation/pkk-validation";
import { TFunction } from "i18next";

export class PkkService {
  static async getAll(page: number = 1, limit: number = 10) {
    const programs = await prismaClient.program.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalProgram = await prismaClient.program.count({});
    return {
      total_page: Math.ceil(totalProgram / limit),
      page,
      limit,
      programs,
    };
  }

  static async create(
    t: TFunction,
    request: PkkCreateRequest,
    file?: Express.Multer.File
  ) {
    Validation.validate(PkkValidation.create, request);

    if (!file) {
      throw new ResponseError(400, t("pkk.featured_image_required"));
    }

    request.featured_image = file.filename;
    const program = await prismaClient.program.create({
      data: {
        ...request,
      },
    });

    return { program: program };
  }
  static async update(
    t: TFunction,
    request: PkkUpdateRequest,
    programId: string,
    file?: Express.Multer.File
  ) {
    Validation.validate(PkkValidation.update, request);

    const program = await prismaClient.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new ResponseError(404, t("pkk.program_not_found"));
    }

    if (file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        program.featured_image
      );
      await fs.unlink(filePath);
    }

    const programUpdate = await prismaClient.program.update({
      where: { id: program.id },
      data: {
        ...request,
        featured_image: file ? file.filename : program.featured_image,
      },
    });

    return { program: programUpdate };
  }
  static async delete(t: TFunction, programId: string) {
    const program = await prismaClient.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new ResponseError(404, t("pkk.program_not_found"));
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      program.featured_image
    );
    await fs.unlink(filePath);

    await prismaClient.program.delete({
      where: { id: programId },
    });
  }
}
