import { ActivityLog } from "@prisma/client";

export interface QueryActivityLogRequet {
  page?: number;
  size?: number;
}

export interface AllActivityLogResponse {
  size: number;
  total_page: number;
  current_page: number;
  data: ActivityLog[];
}

export const toAllActivityLogResponse = (
  size: number,
  total: number,
  currentPage: number,
  data: ActivityLog[]
) => {
  return {
    size: size,
    total_page: Math.floor(total / size),
    current_page: currentPage,
    data: data,
  };
};
