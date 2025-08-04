import z, { ZodType } from "zod";

export class ProductValidation {
  static create: ZodType = z.object({
    title: z.string({ message: "zodErrors.required" }),
    description: z.string({ message: "zodErrors.required" }),
    price: z.number({ message: "zodErrors.required" }),
    category_id: z.string({ message: "zodErrors.required" }),
    link_whatsapp: z.string({ message: "zodErrors.required" }),
  });
  static update: ZodType = z.object({
    title: z.string({ message: "zodErrors.invalid_type" }).optional(),
    description: z.string({ message: "zodErrors.invalid_type" }).optional(),
    price: z.number({ message: "zodErrors.invalid_type" }).optional(),
    category_id: z.string({ message: "zodErrors.invalid_type" }).optional(),
    link_whatsapp: z.string({ message: "zodErrors.invalid_type" }).optional(),
  });
}
