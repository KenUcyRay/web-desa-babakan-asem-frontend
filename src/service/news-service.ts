import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  NewsCreateRequest,
  NewsUpdateRequest,
  toNewsGetAllResponse,
  toNewsWithUserGetAllResponse,
} from "../model/news-model";
import { UserResponse } from "../model/user-model";
import { NewsValidation } from "../validation/news-validation";
import { Validation } from "../validation/validation";
import path from "node:path";
import fs from "node:fs/promises";
import axios from "axios";

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
    return toNewsGetAllResponse(totalMessages, page, limit, news);
  }
  static async create(
    request: NewsCreateRequest,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    Validation.validate(NewsValidation.create, request);

    if (!file) {
      throw new ResponseError(400, "Featured image is required");
    }

    const news = await prismaClient.news.create({
      data: {
        ...request,
        userId: user.id,
        featured_image: file.filename,
        ...(request.is_published === true && {
          published_at: new Date(),
        }),
      },
    });

    return { news: news };
  }
  static async update(
    request: NewsUpdateRequest,
    user: UserResponse,
    newsId: string,
    file?: Express.Multer.File
  ) {
    Validation.validate(NewsValidation.update, request);

    const news = await prismaClient.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      throw new ResponseError(404, "News not found");
    }

    if (news.userId !== user.id) {
      throw new ResponseError(403, "Forbidden");
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
  static async delete(newsId: string, user: UserResponse, token: string) {
    const news = await prismaClient.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      throw new ResponseError(404, "News not found");
    }

    if (news.userId !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    await axios.delete(
      `http://localhost:4000/api/private/comments/delete-by-target/${newsId}?targetType=NEWS`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

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
  static async deleteByAdmin(user: UserResponse, token: string) {
    const news = await prismaClient.news.findMany({
      where: { userId: user.id },
    });

    await Promise.all(
      news.map((n) => {
        return axios.delete(
          `http://localhost:4000/api/private/comments/delete-by-target/${n.id}?targetType=NEWS`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      })
    );

    await prismaClient.news.deleteMany({
      where: { userId: user.id },
    });

    await Promise.all(
      news.map((n) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "images",
          n.featured_image
        );
        return fs.unlink(filePath);
      })
    );
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
        const response = await axios.get(
          `http://localhost:4000/api/users/${n.userId}`
        );
        return {
          user_created: response.data.user,
          news: n,
        };
      })
    );
    return toNewsWithUserGetAllResponse(totalAgenda, page, limit, newsWithUser);
  }

  static async getById(newsId: string) {
    const news = await prismaClient.news.findUnique({
      where: { id: newsId, is_published: true },
    });
    if (!news) {
      throw new ResponseError(404, "News not found");
    }

    await prismaClient.news.update({
      where: news,
      data: {
        view_count: { increment: 1 },
      },
    });

    const comments = await axios.get(
      `http://localhost:4000/api/comments/${newsId}`
    );
    const user = await axios.get(
      `http://localhost:3002/api/users/${news.userId}`
    );
    return {
      user_created: user.data.user,
      news: news,
      comments: comments.data.comments,
    };
  }

  static async getAllTypeById(newsId: string) {
    const news = await prismaClient.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      throw new ResponseError(404, "News not found");
    }

    const comments = await axios.get(
      `http://localhost:4000/api/comments/${newsId}`
    );
    const user = await axios.get(
      `http://localhost:3002/api/users/${news.userId}`
    );
    return {
      user_created: user.data.user,
      news: news,
      comments: comments.data.comments,
    };
  }
}
