import axios from "axios";
import { prismaClient } from "../application/database";
import {
  CommentCreateRequest,
  CommentUpdateRequest,
} from "@/model/comment-model";
import { UserResponse } from "@/model/user-model";
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
        const response = await axios.get(
          `http://localhost:4000/api/users/${comment.user_id}`
        );
        return {
          ...response.data,
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
    console.log("Target ID:", targetId);

    Validation.validate(CommentValidation.create, request);

    if (request.target_type === TargetType.NEWS) {
      await axios.get(`http://localhost:4000/api/news/${targetId}`);
    } else if (request.target_type === TargetType.AGENDA) {
      await axios.get(`http://localhost:4000/api/agenda/${targetId}`);
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
  static async deleteByTarget(
    targetId: string,
    user: UserResponse,
    targetType: string
  ) {
    if (targetType === TargetType.NEWS) {
      const news = await axios.get(
        `http://localhost:4000/api/news/all-type/${targetId}`
      );
      if (news.data.news.userId !== user.id) {
        throw new ResponseError(
          403,
          "You are not authorized to delete comments for this target"
        );
      }
    } else if (targetType === TargetType.AGENDA) {
      const agenda = await axios.get(
        `http://localhost:4000/api/agenda/all-type/${targetId}`
      );
      if (agenda.data.agenda.userId !== user.id) {
        throw new ResponseError(
          403,
          "You are not authorized to delete comments for this target"
        );
      }
    } else if (targetType === TargetType.PRODUCT) {
      const product = await axios.get(
        `http://localhost:4000/api/products/${targetId}`
      );
      if (product.data.product.user_id !== user.id) {
        throw new ResponseError(
          403,
          "You are not authorized to delete comments for this target"
        );
      }
    } else {
      throw new ResponseError(400, "Invalid target type");
    }

    await prismaClient.comment.deleteMany({
      where: {
        target_id: targetId,
      },
    });

    return { message: "Comments deleted successfully" };
  }
  static async deleteByUser(user: UserResponse) {
    await prismaClient.comment.deleteMany({
      where: { user_id: user.id },
    });

    return { message: "Comments deleted successfully" };
  }
}
