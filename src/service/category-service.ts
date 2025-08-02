import fs from "node:fs/promises";
import path from "node:path";
import { ProductValidation } from "./../validation/product-validation";
import { prismaClient } from "../application/database";
import {
  ProductCreateRequest,
  ProductUpdateRequest,
  toProductWithRatingGetAllResponse,
} from "../model/product-model";
import { UserResponse } from "../model/user-model";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { CategoryCreateRequest } from "../model/category-model";
import { CategoryValidation } from "../validation/category-validation";
import { Helper } from "../util/helper";
import axios from "axios";

export class CategoryService {
  static async getCategories() {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return { categories: categories };
  }
  static async createCategory(request: CategoryCreateRequest) {
    Validation.validate(CategoryValidation.create, request);

    request.name = Helper.toTitleCase(request.name);

    const categoryCount = await prismaClient.category.count({
      where: {
        name: request.name,
      },
    });

    if (categoryCount !== 0) {
      throw new ResponseError(400, "Category already exists");
    }

    const category = await prismaClient.category.create({
      data: {
        name: request.name,
      },
    });

    return { category: category };
  }
  static async updateCategory(
    categoryId: string,
    request: CategoryCreateRequest
  ) {
    Validation.validate(CategoryValidation.create, request);

    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new ResponseError(404, "Category not found");
    }

    request.name = Helper.toTitleCase(request.name);
    const categoryUpdate = await prismaClient.category.update({
      where: { id: categoryId },
      data: {
        name: request.name,
      },
    });

    return { category: categoryUpdate };
  }
  static async deleteCategory(categoryId: string) {
    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new ResponseError(404, "Category not found");
    }
    await prismaClient.category.delete({ where: { id: categoryId } });
  }


}
