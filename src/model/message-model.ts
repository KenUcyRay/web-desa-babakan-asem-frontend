import { Message } from "@prisma/client";
export interface CreateMessageRequest {
  name: string;
  email: string;
  message: string;
}

export interface QueryMessageRequest {
  page?: number;
  size?: number;
  isRead?: boolean;
}

export interface AllMessageResponse {
  size: number;
  total_page: number;
  current_page: number;
  data: Message[];
}

export const toAllMessageResponse = (
  size: number,
  total: number,
  currentPage: number,
  data: Message[]
): AllMessageResponse => {
  return {
    size: size,
    total_page: Math.floor(total / size),
    current_page: currentPage,
    data,
  };
};
