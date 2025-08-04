import { StatusDesa } from "@prisma/client";
import z, { ZodType } from "zod";

export class InfografisValidation {
  static createIdm: ZodType = z.object({
    year: z
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(2000, { message: "zodErrors.min_value" }),
    skor: z.number({ message: "zodErrors.required" }),
  });

  static updateIdm: ZodType = z.object({
    year: z
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(2000, { message: "zodErrors.min_value" })
      .optional(),
    skor: z.number({ message: "zodErrors.invalid_type" }).optional(),
  });

  static createBansos: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    amount: z
      .number({ message: "zodErrors.required" })
      .min(0, { message: "zodErrors.min_value" }),
  });

  static updateBansos: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.required" })
      .optional(),
    amount: z
      .number({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" })
      .optional(),
  });

  static updateSdgs: ZodType = z.object({
    progres: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
  });

  static updateExtraIdm: ZodType = z.object({
    status_desa: z
      .nativeEnum(StatusDesa, { message: "zodErrors.invalid_value" })
      .optional(),
    sosial: z.number({ message: "zodErrors.invalid_type" }).optional(),
    ekonomi: z.number({ message: "zodErrors.invalid_type" }).optional(),
    lingkungan: z.number({ message: "zodErrors.invalid_type" }).optional(),
    created_at: z.date({ message: "zodErrors.invalid_type" }).optional(),
  });
}
