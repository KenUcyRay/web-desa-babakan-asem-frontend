import { TFunction } from "i18next";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { UserResponse } from "../model/user-model";
import { RatingValidation } from "../validation/rating-validation";
import { Validation } from "../validation/validation";

export class RatingService {
  static async alreadyRated(
    t: TFunction,
    productId: string,
    user: UserResponse
  ): Promise<{ id?: string; rated: boolean; rating?: number }> {
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ResponseError(404, t("product.not_found"));
    }

    const rating = await prismaClient.rating.findFirst({
      where: {
        user_id: user.id,
        product_id: productId,
      },
    });

    if (!rating) {
      throw new ResponseError(400, t("rating.not_rated_yet"));
    }

    return {
      id: rating.id,
      rating: rating.rating,
      rated: !!rating,
    };
  }
  static async createRating(
    t: TFunction,
    request: { rating: number },
    productId: string,
    user: UserResponse
  ) {
    Validation.validate(RatingValidation.create, request);
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ResponseError(404, t("product.not_found"));
    }

    const ratingExists = await prismaClient.rating.findFirst({
      where: {
        user_id: user.id,
        product_id: productId,
      },
    });

    if (ratingExists) {
      throw new ResponseError(400, t("rating.already_rated"));
    }

    const rating = await prismaClient.rating.create({
      data: {
        user_id: user.id,
        product_id: productId,
        rating: request.rating,
      },
    });

    return { rating: rating };
  }
  static async updateRating(
    t: TFunction,
    ratingId: string,
    request: { rating: number },
    user: UserResponse
  ) {
    const requestValidation = Validation.validate(
      RatingValidation.create,
      request
    );
    const rating = await prismaClient.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new ResponseError(404, t("rating.not_found"));
    }

    if (rating.user_id !== user.id) {
      throw new ResponseError(403, t("rating.not_allowed_update"));
    }

    const updatedRating = await prismaClient.rating.update({
      where: { id: ratingId },
      data: { rating: requestValidation.rating },
    });

    return { rating: updatedRating };
  }
  static async deleteRating(
    t: TFunction,
    ratingId: string,
    user: UserResponse
  ) {
    const rating = await prismaClient.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new ResponseError(404, t("rating.not_found"));
    }

    if (rating.user_id !== user.id) {
      throw new ResponseError(403, t("rating.not_allowed_delete"));
    }

    await prismaClient.rating.delete({
      where: { id: ratingId },
    });
  }
}
