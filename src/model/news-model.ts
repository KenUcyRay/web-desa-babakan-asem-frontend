import { News } from "@prisma/client";
import { UserResponse } from "./user-model";

export interface NewsCreateRequest {
  title: string;
  content: string;
  is_published?: boolean;
}
export interface NewsUpdateRequest {
  title?: string;
  content?: string;
  is_published?: boolean;
}

export interface QueryNewsRequest {
  page?: number;
  limit?: number;
  is_published?: boolean;
}

export interface AllNewsResponse {
  size: number;
  total_page: number;
  current_page: number;
  data: News[];
}

export const toAllNewsResponse = (
  size: number,
  total: number,
  currentPage: number,
  data: News[]
): AllNewsResponse => {
  return {
    size: size,
    total_page: Math.floor(total / size),
    current_page: currentPage,
    data,
  };
};

export interface NewsWithUser {
  user_created: UserResponse;
  news: News;
}

export interface NewsWithUserGetAllResponse {
  total_page: number;
  page: number;
  limit: number;
  news: NewsWithUser[];
}

export const toNewsWithUserGetAllResponse = (
  total_page: number,
  page: number,
  limit: number,
  news: NewsWithUser[]
): NewsWithUserGetAllResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    news,
  };
};
