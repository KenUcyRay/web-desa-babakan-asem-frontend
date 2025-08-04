import { z, ZodType } from "zod";

export class VillageAchievementValidation {
  static create: ZodType = z.object({
    title: z
      .string({ message: "zodErrors.required" })
      .max(255, { message: "zodErrors.max_length" }),
    description: z.string({ message: "zodErrors.required" }),
    date: z.coerce.date({ message: "zodErrors.invalid_type" }),
  });

  static update: ZodType = z.object({
    title: z
      .string({ message: "zodErrors.invalid_type" })
      .max(255, { message: "zodErrors.max_length" })
      .optional(),
    description: z.string({ message: "zodErrors.invalid_type" }).optional(),
    date: z.coerce.date({ message: "zodErrors.invalid_type" }).optional(),
  });
}
