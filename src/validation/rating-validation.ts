import { z, ZodType } from "zod";

export class RatingValidation {
  static create: ZodType = z.object({
    rating: z
      .number()
      .min(1)
      .max(5)
      .int()
      .describe("Rating must be an integer between 1 and 5"),
  });
}
