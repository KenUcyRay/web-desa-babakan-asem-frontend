import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  ProductCreateRequest,
  ProductUpdateRequest,
  toProductWithRatingGetAllResponse,
} from "../model/product-model";
import { UserResponse } from "@/model/user-model";
import { Validation } from "@/validation/validation";
import { ProductValidation } from "@/validation/product-validation";

export class ProductService {
  static async getAll(page: number, limit: number) {
    const products = await prismaClient.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        ratings: true,
      },
    });

    const producsWithRating = products.map((product) => {
      const averageRating =
        product.ratings.length > 0
          ? product.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            product.ratings.length
          : 0;
      return {
        product: product,
        average_rating: averageRating,
      };
    });

    const totalProduct = await prismaClient.product.count({});
    return toProductWithRatingGetAllResponse(
      totalProduct,
      page,
      limit,
      producsWithRating
    );
  }
  static async getById(productId: string) {
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
      include: {
        ratings: true,
      },
    });
    if (!product) {
      throw new ResponseError(404, "Product not found");
    }

    const averageRating =
      product.ratings.length > 0
        ? product.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          product.ratings.length
        : 0;

    const comments = await axios.get(
      `http://localhost:4000/api/comments/${productId}`
    );
    // const user = await axios.get(
    //   `http://localhost:3002/api/users/${product.user_id}`
    // );
    return {
      // user_created: user.data.user,
      rating: averageRating,
      product: product,
      comments: comments.data.comments,
    };
  }
  static async getOwn(user: UserResponse, page: number, limit: number) {
    const products = await prismaClient.product.findMany({
      where: {
        user_id: user.id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        ratings: true,
      },
    });

    const producsWithRating = products.map((product) => {
      const averageRating =
        product.ratings.length > 0
          ? product.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            product.ratings.length
          : 0;
      return {
        product: product,
        average_rating: averageRating,
      };
    });

    const totalProduct = await prismaClient.product.count({
      where: {
        user_id: user.id,
      },
    });

    return toProductWithRatingGetAllResponse(
      totalProduct,
      page,
      limit,
      producsWithRating
    );
  }
  static async create(
    request: ProductCreateRequest,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    request.price = Number(request.price);
    if (isNaN(request.price)) {
      throw new ResponseError(404, "Price must be a number");
    }
    Validation.validate(ProductValidation.create, request);

    const category = await prismaClient.category.findUnique({
      where: { id: request.category_id },
    });

    if (!category) {
      throw new ResponseError(404, "Category not found");
    }

    if (!file) {
      throw new ResponseError(400, "Featured image is required");
    }

    const product = await prismaClient.product.create({
      data: {
        ...request,
        user_id: user.id,
        featured_image: file.filename,
      },
    });

    return { product: product };
  }
  static async update(
    request: ProductUpdateRequest,
    user: UserResponse,
    productId: string,
    file?: Express.Multer.File
  ) {
    if (request.price) {
      request.price = Number(request.price);
      if (isNaN(request.price)) {
        throw new ResponseError(404, "Price must be a number");
      }
    }

    Validation.validate(ProductValidation.update, request);

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ResponseError(404, "Product not found");
    }

    if (product.user_id !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    if (file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        product.featured_image
      );
      await fs.unlink(filePath);
    }

    const productUpdate = await prismaClient.product.update({
      where: { id: product.id },
      data: {
        ...(request.title && { title: request.title }),
        ...(request.description && { description: request.description }),
        ...(request.price && { price: request.price }),
        ...(request.category_id && { category_id: request.category_id }),
        ...(request.link_whatsapp && { link_whatsapp: request.link_whatsapp }),
        ...(file && { featured_image: file.filename }),
      },
    });

    return { product: productUpdate };
  }
  static async delete(productId: string, user: UserResponse, token: string) {
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ResponseError(404, "Product not found");
    }

    if (product.user_id !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    await axios.delete(
      `http://localhost:4000/api/private/comments/delete-by-target/${productId}?targetType=PRODUCT`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      product.featured_image
    );

    Promise.all([
      await prismaClient.product.delete({
        where: { id: productId },
      }),
      await fs.unlink(filePath),
    ]);
  }
  static async deleteByAdmin(user: UserResponse, token: string) {
    const products = await prismaClient.product.findMany({
      where: { user_id: user.id },
    });

    await Promise.all(
      products.map((product) => {
        return axios.delete(
          `http://localhost:4000/api/private/comments/delete-by-target/${product.id}?targetType=PRODUCT`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      })
    );

    await prismaClient.product.deleteMany({
      where: { user_id: user.id },
    });

    await Promise.all(
      products.map((product) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "images",
          product.featured_image
        );
        return fs.unlink(filePath);
      })
    );
  }
}
