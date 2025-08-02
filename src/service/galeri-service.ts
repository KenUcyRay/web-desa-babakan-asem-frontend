import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { UserResponse } from "../model/user-model";
import path from "node:path";
import fs from "node:fs/promises";
import {
  GaleriCreateRequest,
  GaleriUpdateRequest,
} from "../model/galeri-model";
import { Validation } from "../validation/validation";
import { GaleriValidation } from "../validation/galeri-validation";
import { toGaleriGetAllResponse } from "../model/galeri-model";

export class GaleriService {
  static async create(
    request: GaleriCreateRequest,
    file?: Express.Multer.File
  ) {
    Validation.validate(GaleriValidation.create, request);
    if (!file) {
      throw new ResponseError(400, "Featured image is required");
    }

    const galeri = await prismaClient.galeri.create({
      data: {
        ...request,
        image: file.filename,
      },
    });

    return { galeri: galeri };
  }
  static async update(
    galeriId: string,
    request: GaleriUpdateRequest,
    file?: Express.Multer.File
  ) {
    const galeri = await prismaClient.galeri.findUnique({
      where: { id: galeriId },
    });

    if (!galeri) {
      throw new ResponseError(404, "Galeri not found");
    }

    Validation.validate(GaleriValidation.update, request);

    if (file) {
      request.image = file.filename;
    } else {
      request.image = undefined;
    }

    const galeriUpdate = await prismaClient.galeri.update({
      where: { id: galeriId },
      data: request,
    });

    return { galeri: galeriUpdate };
  }
  static async delete(galeriId: string) {
    const galeri = await prismaClient.galeri.findUnique({
      where: { id: galeriId },
    });

    if (!galeri) {
      throw new ResponseError(404, "Galeri not found");
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      galeri.image
    );

    Promise.all([
      await prismaClient.galeri.delete({
        where: { id: galeriId },
      }),
      await fs.unlink(filePath),
    ]);
  }

  static async getAll(page: number, limit: number) {
    const galeri = await prismaClient.galeri.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalGaleri = await prismaClient.galeri.count({});
    return toGaleriGetAllResponse(totalGaleri, page, limit, galeri);
  }
}
