import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { SiteContentType } from "@prisma/client";
import path from "node:path";
import fs from "node:fs/promises";
import {
  CreateSiteContentRequest,
  QuerySiteContentRequest,
  toAllSiteContentResponse,
  UpdateSiteContentRequest,
} from "@/model/site-content-model";
import { Validation } from "@/validation/validation";
import { SiteContentValidation } from "@/validation/site-content-validation";
import { TFunction } from "i18next";

export class SiteContentService {
  static async getAll(query: QuerySiteContentRequest) {
    const queryValidation = Validation.validate(
      SiteContentValidation.query,
      query
    );

    const siteContents = await prismaClient.siteContent.findMany({
      skip: (queryValidation.page! - 1) * queryValidation.limit!,
      take: queryValidation.limit!,
      where: {
        ...(queryValidation.type ? { type: queryValidation.type } : undefined),
        ...(queryValidation.search
          ? {
              OR: [
                { key: { contains: queryValidation.search } },
                { value_id: { contains: queryValidation.search } },
                { value_en: { contains: queryValidation.search } },
              ],
            }
          : undefined),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prismaClient.siteContent.count({
      where: {
        ...(queryValidation.type ? { type: queryValidation.type } : undefined),
        ...(queryValidation.search
          ? {
              OR: [
                { key: { contains: queryValidation.search } },
                { value_id: { contains: queryValidation.search } },
                { value_en: { contains: queryValidation.search } },
              ],
            }
          : undefined),
      },
    });

    return toAllSiteContentResponse(
      queryValidation.limit!,
      total,
      queryValidation.page!,
      siteContents
    );
  }
  static async getByKey(key: string) {
    const siteContent = await prismaClient.siteContent.findUnique({
      where: { key },
    });

    if (!siteContent) {
      throw new ResponseError(404, "site_content.not_found");
    }

    return { data: siteContent };
  }
  static async create(
    t: TFunction,
    body: CreateSiteContentRequest,
    file?: Express.Multer.File
  ) {
    const bodyValidation = Validation.validate(
      SiteContentValidation.create,
      body
    );
    const countSiteContentSameKey = await prismaClient.siteContent.count({
      where: { key: bodyValidation.key },
    });

    if (countSiteContentSameKey !== 0) {
      throw new ResponseError(400, "site_content.key_already_exists");
    }

    if (file && bodyValidation.type === SiteContentType.IMAGE) {
      bodyValidation.value_id = file.filename;
      bodyValidation.value_en = file.filename;
    }

    const siteContent = await prismaClient.siteContent.create({
      data: {
        key: bodyValidation.key,
        value_id: bodyValidation.value_id!,
        value_en: bodyValidation.value_en!,
        type: bodyValidation.type,
      },
    });

    return { data: siteContent };
  }
  static async update(
    t: TFunction,
    id: string,
    body: UpdateSiteContentRequest,
    file?: Express.Multer.File
  ) {
    const findSiteContent = await prismaClient.siteContent.findUnique({
      where: { id },
    });

    if (!findSiteContent) {
      throw new ResponseError(404, "site_content.not_found");
    }

    const bodyValidation = Validation.validate(
      SiteContentValidation.update,
      body
    );

    if (file && bodyValidation.type === SiteContentType.IMAGE) {
      bodyValidation.value_id = file.filename;
      bodyValidation.value_en = file.filename;
    }

    const siteContent = await prismaClient.siteContent.update({
      where: { id },
      data: {
        key: bodyValidation.key ? findSiteContent.key : undefined,
        value_id: bodyValidation.value_id
          ? findSiteContent.value_id
          : undefined,
        value_en: bodyValidation.value_en
          ? findSiteContent.value_en
          : undefined,
        type: bodyValidation.type ? findSiteContent.type : undefined,
      },
    });

    if (
      (findSiteContent.type === SiteContentType.IMAGE && file) ||
      (findSiteContent.type === SiteContentType.IMAGE &&
        bodyValidation.type !== SiteContentType.IMAGE)
    ) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        findSiteContent.value_id
      );
      await fs.unlink(filePath);
    }

    return { data: siteContent };
  }
  static async delete(id: string) {
    const siteContent = await prismaClient.siteContent.findUnique({
      where: { id },
    });

    if (!siteContent) {
      throw new ResponseError(404, "site_content.not_found");
    }

    await prismaClient.siteContent.delete({
      where: { id },
    });

    if (siteContent.type === SiteContentType.IMAGE) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        siteContent.value_id
      );
      await fs.unlink(filePath);
    }
  }
}
