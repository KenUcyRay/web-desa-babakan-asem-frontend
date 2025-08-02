import { z, ZodType } from "zod";

export class CategoryValidation {
  static create: ZodType = z.object({
    name: z.string(),
  });
}
