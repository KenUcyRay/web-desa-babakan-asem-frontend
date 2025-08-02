import { VillageWorkProgramStatus } from "@prisma/client";
import { ZodType, z } from "zod";
export class VillageWorkProgramValidation {
  static create: ZodType = z.object({
    description: z.string(),
    date: z.coerce.date(),
    status: z.nativeEnum(VillageWorkProgramStatus),
    justification: z.string(),
    budget_amount: z.coerce.number().positive(),
  });

  static update: ZodType = z.object({
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    status: z.nativeEnum(VillageWorkProgramStatus).optional(),
    justification: z.string().optional(),
    budget_amount: z.coerce.number().positive().optional(),
  });
}
