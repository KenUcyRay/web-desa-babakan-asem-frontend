import z, { ZodType } from "zod";

export class GaleriValidation {
  static create: ZodType = z.object({
    title: z.string({ message: "zodErrors.required" }),
  });
  static update: ZodType = z.object({
    title: z.string({ message: "zodErrors.invalid_type" }).optional(),
  });
}
