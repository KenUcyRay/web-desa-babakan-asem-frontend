import z, { ZodType } from "zod";

export class MessageValidation {
  static create: ZodType = z.object({
    name: z.string().max(255),
    email: z.string().email().max(255),
    message: z.string(),
  });

  static query: ZodType = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    isRead: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean().optional()),
  });
}
