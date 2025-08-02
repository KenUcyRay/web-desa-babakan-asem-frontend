import z, { ZodType } from "zod";

export class ProductValidation {
  static create: ZodType = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    category_id: z.string(),
    link_whatsapp: z.string(),
  });
  static update: ZodType = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    category_id: z.string().optional(),
    link_whatsapp: z.string().optional(),
  });
}
