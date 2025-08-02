import { Product } from "@prisma/client";

export interface ProductCreateRequest {
  category_id: string;
  title: string;
  description: string;
  price: number;
  link_whatsapp: string;
}

export interface ProductUpdateRequest {
  category_id?: string;
  title?: string;
  description?: string;
  price?: number;
  link_whatsapp?: string;
}

export interface ProductWithRating {
  product: Product;
  average_rating: number;
}

export interface ProductWithRatingGetAllResponse {
  total_page: number;
  page: number;
  limit: number;
  products: ProductWithRating[];
}

export const toProductWithRatingGetAllResponse = (
  total_page: number,
  page: number,
  limit: number,
  products: ProductWithRating[]
): ProductWithRatingGetAllResponse => {
  return {
    total_page: Math.ceil(total_page / limit),
    page,
    limit,
    products,
  };
};
