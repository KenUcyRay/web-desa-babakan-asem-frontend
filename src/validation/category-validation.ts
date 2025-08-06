import { z, ZodType } from "zod";

export class CategoryValidation {
  static create: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.min_length" }),
  });
}
