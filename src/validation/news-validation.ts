import z, { ZodType } from "zod";

export class NewsValidation {
  static create: ZodType = z.object({
    title: z.string(),
    content: z.string(),
    is_published: z.boolean().optional(),
  });
  static update: ZodType = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    is_published: z.boolean().optional(),
  });
}
