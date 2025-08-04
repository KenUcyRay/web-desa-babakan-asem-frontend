import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  AgendaCreateRequest,
  AgendaUpdateRequest,
  toAgendaGetAllResponse,
  toAgendaWithUserGetAllResponse,
} from "../model/agenda-model";
import { toUserResponse, UserResponse } from "../model/user-model";
import { AgendaValidation } from "../validation/agenda-validation";
import { Validation } from "../validation/validation";
import path from "node:path";
import fs from "node:fs/promises";
import axios from "axios";
import { AgendaType } from "@prisma/client";

export class AgendaService {
  static async getOwn(
    user: UserResponse,
    page: number,
    limit: number,
    isPublished: boolean | undefined,
    type: AgendaType
  ) {
    const agenda = await prismaClient.agenda.findMany({
      where: {
        ...(isPublished !== undefined && { is_published: isPublished }),
        userId: user.id,
        ...(type && { type: type }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalAgenda = await prismaClient.agenda.count({
      where: {
        ...(isPublished !== undefined && { is_published: isPublished }),
        userId: user.id,
        ...(type && { type: type }),
      },
    });
    return toAgendaGetAllResponse(totalAgenda, page, limit, agenda);
  }
  static async create(
    request: AgendaCreateRequest,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    Validation.validate(AgendaValidation.create, request);

    if (!file) {
      throw new ResponseError(400, "Featured image is required");
    }

    const agenda = await prismaClient.agenda.create({
      data: {
        ...request,
        userId: user.id,
        featured_image: file.filename,
        ...(request.is_published === true && {
          published_at: new Date(),
        }),
      },
    });

    return { agenda: agenda };
  }
  static async update(
    request: AgendaUpdateRequest,
    user: UserResponse,
    agendaId: string,
    file?: Express.Multer.File
  ) {
    Validation.validate(AgendaValidation.update, request);

    const agenda = await prismaClient.agenda.findUnique({
      where: { id: agendaId },
    });

    if (!agenda) {
      throw new ResponseError(404, "Agenda not found");
    }

    if (agenda.userId !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    if (file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        agenda.featured_image
      );
      await fs.unlink(filePath);
    }

    const agendaUpdate = await prismaClient.agenda.update({
      where: { id: agenda.id },
      data: {
        ...(request.title && { title: request.title }),
        ...(request.content && { content: request.content }),
        ...(request.start_time && { start_time: request.start_time }),
        ...(request.end_time && { end_time: request.end_time }),
        ...(request.location && { location: request.location }),
        ...(request.type && { type: request.type }),
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

    return { agenda: agendaUpdate };
  }
  static async delete(agendaId: string, user: UserResponse, token: string) {
    const agenda = await prismaClient.agenda.findUnique({
      where: { id: agendaId },
    });

    if (!agenda) {
      throw new ResponseError(404, "Agenda not found");
    }

    if (agenda.userId !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    await prismaClient.comment.deleteMany({
      where: { target_id: agendaId, target_type: "AGENDA" },
    });

    const agendaDelete = await prismaClient.agenda.delete({
      where: { id: agendaId },
    });

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      agenda.featured_image
    );

    await fs.unlink(filePath);

    return agendaDelete;
  }

  static async getAll(page: number, limit: number, type: AgendaType) {
    const agenda = await prismaClient.agenda.findMany({
      where: {
        is_published: true,
        ...(type && { type: type }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalAgenda = await prismaClient.agenda.count({
      where: {
        is_published: true,
        ...(type && { type: type }),
      },
    });
    const agendaWithUser = await Promise.all(
      agenda.map(async (agenda) => {
        const user = await prismaClient.user.findUnique({
          where: { id: agenda.userId },
        });
        return {
          user_created: toUserResponse(user!),
          agenda: agenda,
        };
      })
    );
    return toAgendaWithUserGetAllResponse(
      totalAgenda,
      page,
      limit,
      agendaWithUser
    );
  }
  static async getById(agendaId: string) {
    const agenda = await prismaClient.agenda.findUnique({
      where: { id: agendaId, is_published: true },
    });
    if (!agenda) {
      throw new ResponseError(404, "Agenda not found");
    }

    await prismaClient.agenda.update({
      where: agenda,
      data: {
        view_count: { increment: 1 },
      },
    });

    const comments = await prismaClient.comment.findMany({
      where: { target_id: agendaId, target_type: "AGENDA" },
      orderBy: {
        created_at: "desc",
      },
    });
    const user = await prismaClient.user.findUnique({
      where: { id: agenda.userId },
    });

    return {
      user_created: toUserResponse(user!),
      agenda: agenda,
      comments: comments,
    };
  }
}
