import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateMessageRequest,
  toAllMessageResponse,
} from "@/model/message-model";
import { MessageValidation } from "../validation/message-validation";
import { Validation } from "../validation/validation";

export class MessageService {
  static async create(request: CreateMessageRequest) {
    Validation.validate(MessageValidation.create, request);

    const message = await prismaClient.message.create({
      data: request,
    });
    return message;
  }
  static async getAll(
    page: number,
    limit: number,
    isRead: boolean | undefined
  ) {
    const messages = await prismaClient.message.findMany({
      where: {
        ...(isRead !== undefined && { is_read: isRead }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });
    const totalMessages = await prismaClient.message.count({
      where: {
        ...(isRead !== undefined && { is_read: isRead }),
      },
    });
    return toAllMessageResponse(totalMessages, page, limit, messages);
  }
  static async update(messageId: string) {
    const message = await prismaClient.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new ResponseError(404, "Message not found");
    }

    const messageUpdate = await prismaClient.message.update({
      where: {
        id: messageId,
      },
      data: {
        is_read: true,
      },
    });
    return messageUpdate;
  }
  static async delete(messageId: string) {
    const message = await prismaClient.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new ResponseError(404, "Message not found");
    }

    await prismaClient.message.delete({
      where: {
        id: messageId,
      },
    });
  }
}
