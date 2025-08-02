import { Galeri } from "@prisma/client";

export interface GaleriCreateRequest {
  title: string;
}

export interface GaleriUpdateRequest {
  title?: string;
  image?: string;
}

export interface GaleriGetAllResponse {
  total_page: number;
  page: number;
  limit: number;
  galeri: Galeri[];
}

export const toGaleriGetAllResponse = (
  total_page: number,
  page: number,
  limit: number,
  galeri: Galeri[]
): GaleriGetAllResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    galeri,
  };
};
