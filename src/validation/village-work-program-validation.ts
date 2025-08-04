import { VillageWorkProgramStatus } from "@prisma/client";
import { ZodType, z } from "zod";
export class VillageWorkProgramValidation {
  static create: ZodType = z.object({
    description: z.string({ message: "zodErrors.required" }),
    date: z.coerce.date({ message: "zodErrors.invalid_type" }),
    status: z.nativeEnum(VillageWorkProgramStatus, {
      message: "zodErrors.invalid_value",
    }),
    justification: z.string({ message: "zodErrors.required" }),
    budget_amount: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .positive({ message: "zodErrors.min_value" }),
  });

  static update: ZodType = z.object({
    description: z.string({ message: "zodErrors.invalid_type" }).optional(),
    date: z.coerce.date({ message: "zodErrors.invalid_type" }).optional(),
    status: z
      .nativeEnum(VillageWorkProgramStatus, {
        message: "zodErrors.invalid_value",
      })
      .optional(),
    justification: z.string({ message: "zodErrors.invalid_type" }).optional(),
    budget_amount: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .positive({ message: "zodErrors.min_value" })
      .optional(),
  });
}
