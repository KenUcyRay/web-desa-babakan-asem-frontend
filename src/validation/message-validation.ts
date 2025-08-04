import z, { ZodType } from "zod";

export class MessageValidation {
  static create: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.required" })
      .max(255, { message: "zodErrors.max_length" }),
    email: z
      .string({ message: "zodErrors.required" })
      .email({ message: "zodErrors.email" })
      .max(255, { message: "zodErrors.max_length" }),
    message: z.string({ message: "zodErrors.required" }),
  });

  static query: ZodType = z.object({
    page: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .default(1),
    size: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .default(10),
    isRead: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean({ message: "zodErrors.invalid_type" }).optional()),
  });
}
