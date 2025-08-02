import { z, ZodType } from "zod";

export class ApbValidation {
  static create: ZodType = z.object({
    bidang: z.string().min(1, "Bidang is required"),
    anggaran: z.number().min(0, "Anggaran must be a positive number"),
    realisasi: z.number().min(0, "Realisasi must be a positive number"),
    tahun: z.coerce.date().refine((date) => date.getFullYear() >= 2000, {
      message: "Tahun must be a valid year after 2000",
    }),
  });

  static update: ZodType = z.object({
    bidang: z.string().optional(),
    anggaran: z
      .number()
      .min(0, "Anggaran must be a positive number")
      .optional(),
    realisasi: z
      .number()
      .min(0, "Realisasi must be a positive number")
      .optional(),
    tahun: z.coerce
      .date()
      .refine((date) => date.getFullYear() >= 2000, {
        message: "Tahun must be a valid year after 2000",
      })
      .optional(),
  });
}
