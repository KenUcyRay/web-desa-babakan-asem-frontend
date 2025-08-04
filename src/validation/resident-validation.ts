import { ResidentType } from "@prisma/client";
import { z, ZodType } from "zod";

export class ResidentValidation {
  static query: ZodType = z.object({
    type: z.nativeEnum(ResidentType, { message: "zodErrors.invalid_value" }),
  });

  static update: ZodType = z.object({
    value: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" }),
  });
}
