import { AgendaType } from "@prisma/client";
import z, { ZodType } from "zod";

export class AgendaValidation {
  static create: ZodType = z.object({
    title: z.string({ message: "zodErrors.required" }),
    content: z.string({ message: "zodErrors.required" }),
    location: z.string({ message: "zodErrors.required" }),
    start_time: z
      .string({ message: "zodErrors.required" })
      .datetime({ message: "zodErrors.invalid_format" }),
    end_time: z
      .string({ message: "zodErrors.required" })
      .datetime({ message: "zodErrors.invalid_format" }),
    is_published: z.boolean({ message: "zodErrors.invalid_type" }).optional(),
    type: z.nativeEnum(AgendaType, { message: "zodErrors.invalid_value" }), // Assuming AgendaType is an enum in Prisma
  });
  static update: ZodType = z.object({
    title: z.string({ message: "zodErrors.invalid_type" }).optional(),
    content: z.string({ message: "zodErrors.invalid_type" }).optional(),
    location: z.string({ message: "zodErrors.invalid_type" }).optional(),
    start_time: z
      .string({ message: "zodErrors.invalid_type" })
      .datetime({ message: "zodErrors.invalid_format" })
      .optional(),
    end_time: z
      .string({ message: "zodErrors.invalid_type" })
      .datetime({ message: "zodErrors.invalid_format" })
      .optional(),
    is_published: z.boolean({ message: "zodErrors.invalid_type" }).optional(),
    type: z
      .nativeEnum(AgendaType, { message: "zodErrors.invalid_value" })
      .optional(), // Assuming AgendaType is an enum in Prisma
  });
}
