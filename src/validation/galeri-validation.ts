import z, { ZodType } from "zod";

export class GaleriValidation {
  static create: ZodType = z.object({
    title: z.string(),
  });
  static update: ZodType = z.object({
    title: z.string().optional(),
  });
}
