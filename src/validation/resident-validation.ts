import { ResidentType } from "@prisma/client";
import { z, ZodType } from "zod";

export class ResidentValidation {
  static query: ZodType = z.object({
    type: z.nativeEnum(ResidentType),
  });

  static update: ZodType = z.object({
    value: z.coerce.number().int().min(0),
  });
}
