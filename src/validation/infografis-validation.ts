import { StatusDesa } from "@prisma/client";
import z, { ZodType } from "zod";

export class InfografisValidation {
  static createIdm: ZodType = z.object({
    year: z.number().int().min(2000, "Year must be at least 2000"),
    skor: z.number(),
  });

  static updateIdm: ZodType = z.object({
    year: z.number().int().min(2000, "Year must be at least 2000").optional(),
    skor: z.number().optional(),
  });

  static createBansos: ZodType = z.object({
    name: z.string().min(1, "Name must not be empty"),
    amount: z.number().min(0, "Amount must be a non-negative number"),
  });

  static updateBansos: ZodType = z.object({
    name: z.string().min(1, "Name must not be empty").optional(),
    amount: z
      .number()
      .min(0, "Amount must be a non-negative number")
      .optional(),
  });

  static updateSdgs: ZodType = z.object({
    progres: z.string().min(1, "Progress must not be empty"),
  });

  static updateExtraIdm: ZodType = z.object({
    status_desa: z.nativeEnum(StatusDesa).optional(),
    sosial: z.number().optional(),
    ekonomi: z.number().optional(),
    lingkungan: z.number().optional(),
    created_at: z.date().optional(),
  });
}
