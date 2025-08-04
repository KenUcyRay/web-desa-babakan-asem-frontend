import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateMessageRequest,
  QueryMessageRequest,
  toAllMessageResponse,
} from "@/model/message-model";
import { MessageValidation } from "../validation/message-validation";
import { Validation } from "../validation/validation";
import { TFunction } from "i18next";

export class MessageService {
  static async create(request: CreateMessageRequest) {
    Validation.validate(MessageValidation.create, request);

    const message = await prismaClient.message.create({
      data: request,
    });
    return { data: message };
  }
  static async getAll(query: QueryMessageRequest) {
    const queryValidation = Validation.validate(MessageValidation.query, query);

    const messages = await prismaClient.message.findMany({
      where: {
        ...(queryValidation.isRead! !== undefined && {
          is_read: queryValidation.isRead!,
        }),
      },
      skip: (queryValidation.page! - 1) * queryValidation.size!,
      take: queryValidation.size!,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalMessages = await prismaClient.message.count({
      where: {
        ...(queryValidation.isRead! !== undefined && {
          is_read: queryValidation.isRead!,
        }),
      },
    });
    return toAllMessageResponse(
      queryValidation.size!,
      totalMessages,
      queryValidation.page!,
      messages
    );
  }
  static async update(t: TFunction, id: string) {
    const message = await prismaClient.message.findUnique({
      where: {
        id: id,
      },
    });

    if (!message) {
      throw new ResponseError(404, t("message.not_found"));
    }

    const messageUpdate = await prismaClient.message.update({
      where: {
        id: id,
      },
      data: {
        is_read: true,
      },
    });
    return { data: messageUpdate };
  }
}
