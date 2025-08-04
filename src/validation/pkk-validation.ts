import z, { ZodType } from "zod";

export class PkkValidation {
  static create: ZodType = z.object({
    title: z.string({ message: "zodErrors.required" }),
    description: z.string({ message: "zodErrors.required" }),
    featured_image: z.string({ message: "zodErrors.invalid_type" }).optional(),
  });
  static update: ZodType = z.object({
    title: z.string({ message: "zodErrors.invalid_type" }).optional(),
    description: z.string({ message: "zodErrors.invalid_type" }).optional(),
    featured_image: z.string({ message: "zodErrors.invalid_type" }).optional(),
  });
}
