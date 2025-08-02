import z, { ZodType } from "zod";

export class PkkValidation {
  static create: ZodType = z.object({
    title: z.string(),
    description: z.string(),
    featured_image: z.string().optional(),
  });
  static update: ZodType = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    featured_image: z.string().optional(),
  });
}
