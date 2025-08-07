import { TFunction } from "i18next";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  NewsCreateRequest,
  NewsUpdateRequest,
  toAllNewsResponse,
  toNewsWithUserGetAllResponse,
} from "../model/news-model";
import { toUserResponse, UserResponse } from "../model/user-model";
import { NewsValidation } from "../validation/news-validation";
import { Validation } from "../validation/validation";
import path from "node:path";
import fs from "node:fs/promises";
import { Role } from "@prisma/client";

export class NewsService {
  static async getOwn(
    user: UserResponse,
    page: number,
    limit: number,
    isPublished: boolean | undefined
  ) {
    const news = await prismaClient.news.findMany({
      where: {
        ...(isPublished !== undefined && { is_published: isPublished }),
        userId: user.id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalMessages = await prismaClient.news.count({
      where: {
        ...(isPublished !== undefined && { is_published: isPublished }),
        userId: user.id,
      },
    });
    return toAllNewsResponse(limit, totalMessages, page, news);
  }
  static async create(
    t: TFunction,
    request: NewsCreateRequest,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    const validation = Validation.validate(NewsValidation.create, request);

    if (user.role !== Role.CONTRIBUTOR) {
      if (user.role !== Role.ADMIN) {
        throw new ResponseError(403, t("news.contributor_only_create"));
      }
    }

    if (!file) {
      throw new ResponseError(400, t("news.featured_image_required"));
    }

    const news = await prismaClient.news.create({
      data: {
        ...validation,
        userId: user.id,
        featured_image: file.filename,
        ...(validation.is_published === true && {
          published_at: new Date(),
        }),
      },
    });

    return { news: news };
  }
  static async update(
    t: TFunction,
    request: NewsUpdateRequest,
    user: UserResponse,
    newsId: string,
    file?: Express.Multer.File
  ) {
    Validation.validate(NewsValidation.update, request);

    if (user.role !== Role.CONTRIBUTOR) {
      if (user.role !== Role.ADMIN) {
        throw new ResponseError(403, t("news.contributor_only_create"));
      }
    }

    const news = await prismaClient.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      throw new ResponseError(404, t("news.not_found"));
    }

    if (news.userId !== user.id) {
      throw new ResponseError(403, t("common.forbidden"));
    }

    if (file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        news.featured_image
      );
      await fs.unlink(filePath);
    }

    const newsUpdate = await prismaClient.news.update({
      where: { id: news.id },
      data: {
        ...(request.title && { title: request.title }),
        ...(request.content && { content: request.content }),
        ...(request.is_published === true && {
          is_published: request.is_published,
          published_at: new Date(),
        }),
        ...(request.is_published === false && {
          is_published: request.is_published,
          published_at: null,
        }),
        ...(file && { featured_image: file.filename }),
      },
    });

    return { news: newsUpdate };
  }
  static async delete(
    t: TFunction,
    newsId: string,
    user: UserResponse,
    token: string
  ) {
    const news = await prismaClient.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      throw new ResponseError(404, t("news.not_found"));
    }

    if (news.userId !== user.id) {
      throw new ResponseError(403, t("common.forbidden"));
    }

    await prismaClient.comment.deleteMany({
      where: {
        target_id: newsId,
        target_type: "NEWS",
      },
    });

    await prismaClient.news.delete({
      where: { id: newsId },
    });

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      news.featured_image
    );

    await fs.unlink(filePath);
  }

  static async getAll(page: number, limit: number) {
    const news = await prismaClient.news.findMany({
      where: {
        is_published: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalAgenda = await prismaClient.news.count({
      where: {
        is_published: true,
      },
    });
    const newsWithUser = await Promise.all(
      news.map(async (n) => {
        const user = await prismaClient.user.findUnique({
          where: { id: n.userId },
        });
        return {
          user_created: toUserResponse(user!),
          news: n,
        };
      })
    );
    return toNewsWithUserGetAllResponse(totalAgenda, page, limit, newsWithUser);
  }
  static async getById(t: TFunction, newsId: string) {
    const news = await prismaClient.news.findUnique({
      where: { id: newsId, is_published: true },
    });
    if (!news) {
      throw new ResponseError(404, t("news.not_found"));
    }

    await prismaClient.news.update({
      where: { id: newsId },
      data: {
        view_count: { increment: 1 },
      },
    });

    const comments = await prismaClient.comment.findMany({
      where: { target_id: newsId, target_type: "NEWS" },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const user = await prismaClient.user.findUnique({
      where: { id: news.userId },
    });
    return {
      user_created: toUserResponse(user!),
      news: news,
      comments: comments,
    };
  }
}
