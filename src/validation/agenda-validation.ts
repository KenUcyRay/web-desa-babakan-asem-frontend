import { AgendaType } from "@prisma/client";
import z, { ZodType } from "zod";

export class AgendaValidation {
  static create: ZodType = z.object({
    title: z.string(),
    content: z.string(),
    location: z.string(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    is_published: z.boolean().optional(),
    type: z.nativeEnum(AgendaType), // Assuming AgendaType is an enum in Prisma
  });
  static update: ZodType = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    location: z.string().optional(),
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
    is_published: z.boolean().optional(),
    type: z.nativeEnum(AgendaType).optional(), // Assuming AgendaType is an enum in Prisma
  });
}
