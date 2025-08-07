import { SiteContent, SiteContentType } from "@prisma/client";

export interface CreateSiteContentRequest {
  key: string;
  value_id?: string;
  value_en?: string;
  type: SiteContentType;
}

export interface QuerySiteContentRequest {
  page?: number;
  limit?: number;
  type?: SiteContentType;
  search?: string;
}

export interface UpdateSiteContentRequest {
  key?: string;
  value_id?: string;
  value_en?: string;
  type?: SiteContentType;
}

export interface AllSiteContentResponse {
  size: number;
  total_page: number;
  current_page: number;
  data: SiteContent[];
}

export const toAllSiteContentResponse = (
  size: number,
  total: number,
  currentPage: number,
  data: SiteContent[]
): AllSiteContentResponse => {
  return {
    size: size,
    total_page: Math.floor(total / size),
    current_page: currentPage,
    data,
  };
};
