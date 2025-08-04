import { z, ZodType } from "zod";

export class RatingValidation {
  static create: ZodType = z.object({
    rating: z
      .number({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .max(5, { message: "zodErrors.max_value" })
      .int({ message: "zodErrors.invalid_type" }),
  });
}
