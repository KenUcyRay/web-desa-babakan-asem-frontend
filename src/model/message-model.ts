import { Message } from "@prisma/client";
export interface CreateMessageRequest {
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
}

export interface QueryMessageRequest {
  page?: number;
  limit?: number;
  is_read?: boolean;
  search?: string;
}

export interface AllMessageResponse {
  total_page: number;
  page: number;
  limit: number;
  data: Message[];
}

export const toAllMessageResponse = (
  total_page: number,
  page: number,
  limit: number,
  data: Message[]
): AllMessageResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    data,
  };
};
