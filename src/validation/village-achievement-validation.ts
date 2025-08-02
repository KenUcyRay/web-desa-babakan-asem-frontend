import { z, ZodType } from "zod";

export class VillageAchievementValidation {
  static create: ZodType = z.object({
    title: z.string().max(255),
    description: z.string(),
    date: z.coerce.date(),
  });

  static update: ZodType = z.object({
    title: z.string().max(255).optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
  });
}
