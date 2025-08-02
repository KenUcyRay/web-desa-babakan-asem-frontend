import { Comment, TargetType } from "@prisma/client";

export interface CommentCreateRequest {
  target_type: TargetType;
  content: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface CommentGetAllResponse {
  total_page: number;
  page: number;
  limit: number;
  comments: Comment[];
}

export const toCommentGetAllResponse = (
  total_page: number,
  page: number,
  limit: number,
  comments: Comment[]
): CommentGetAllResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    comments,
  };
};
