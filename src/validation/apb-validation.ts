import { z, ZodType } from "zod";

export class ApbValidation {
  static create: ZodType = z.object({
    bidang: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    anggaran: z
      .number({ message: "zodErrors.required" })
      .min(0, { message: "zodErrors.min_value" }),
    realisasi: z
      .number({ message: "zodErrors.required" })
      .min(0, { message: "zodErrors.min_value" }),
    tahun: z.coerce
      .date({ message: "zodErrors.invalid_type" })
      .refine((date) => date.getFullYear() >= 2000, {
        message: "zodErrors.min_value",
      }),
  });

  static update: ZodType = z.object({
    bidang: z.string({ message: "zodErrors.invalid_type" }).optional(),
    anggaran: z
      .number({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" })
      .optional(),
    realisasi: z
      .number({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" })
      .optional(),
    tahun: z.coerce
      .date({ message: "zodErrors.invalid_type" })
      .refine((date) => date.getFullYear() >= 2000, {
        message: "zodErrors.min_value",
      })
      .optional(),
  });
}
