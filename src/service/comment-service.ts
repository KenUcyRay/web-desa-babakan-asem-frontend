import axios from "axios";
import { prismaClient } from "../application/database";
import {
  CommentCreateRequest,
  CommentUpdateRequest,
} from "@/model/comment-model";
import { toUserResponse, UserResponse } from "@/model/user-model";
import { Validation } from "@/validation/validation";
import { CommentValidation } from "@/validation/comment-validation";
import { TargetType } from "@prisma/client";
import { ResponseError } from "@/error/response-error";

export class CommentService {
  static async getByTargetId(targetId: string, page: number, limit: number) {
    const comments = await prismaClient.comment.findMany({
      where: {
        target_id: targetId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await prismaClient.user.findUnique({
          where: { id: comment.user_id },
        });
        return {
          ...toUserResponse(user!),
          ...comment,
        };
      })
    );

    return { comments: enrichedComments };
  }

  static async create(
    request: CommentCreateRequest,
    targetId: string,
    user: UserResponse
  ) {
    Validation.validate(CommentValidation.create, request);

    if (request.target_type === TargetType.NEWS) {
      const news = await prismaClient.news.findUnique({
        where: { id: targetId },
      });

      if (!news) {
        throw new ResponseError(404, "News not found");
      }
    } else if (request.target_type === TargetType.AGENDA) {
      const agenda = await prismaClient.agenda.findUnique({
        where: { id: targetId },
      });
      if (!agenda) {
        throw new ResponseError(404, "Agenda not found");
      }
    }
    const comment = await prismaClient.comment.create({
      data: {
        ...request,
        user_id: user.id,
        target_id: targetId,
      },
    });

    return { comment: comment };
  }
  static async update(
    request: CommentUpdateRequest,
    commentId: string,
    user: UserResponse
  ) {
    Validation.validate(CommentValidation.update, request);

    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new ResponseError(404, "Comment not found");
    }

    if (comment.user_id !== user.id) {
      throw new ResponseError(
        403,
        "You are not authorized to update this comment"
      );
    }

    const commentUpdate = await prismaClient.comment.update({
      where: comment,
      data: {
        ...request,
      },
    });

    return { comment: commentUpdate };
  }
  static async delete(commentId: string, user: UserResponse) {
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new ResponseError(404, "Comment not found");
    }

    if (user.role === "ADMIN" || comment.user_id === user.id) {
      const commentDelete = await prismaClient.comment.delete({
        where: { id: commentId },
      });

      return { comment: commentDelete };
    }

    throw new ResponseError(
      403,
      "You are not authorized to delete this comment"
    );
  }
}
