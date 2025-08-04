import z, { ZodType } from "zod";

export class NewsValidation {
  static create: ZodType = z.object({
    title: z.string({ message: "zodErrors.required" }),
    content: z.string({ message: "zodErrors.required" }),
    is_published: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean({ message: "zodErrors.invalid_type" }).optional()),
  });
  static update: ZodType = z.object({
    title: z.string({ message: "zodErrors.invalid_type" }).optional(),
    content: z.string({ message: "zodErrors.invalid_type" }).optional(),
    is_published: z.boolean({ message: "zodErrors.invalid_type" }).optional(),
  });
}
