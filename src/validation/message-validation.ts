import z, { ZodType } from "zod";

export class MessageValidation {
  static create: ZodType = z
    .object({
      name: z.string().max(255),
      email: z.string().email().max(255).optional(),
      phone_number: z
        .string()
        .max(20)
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "Phone number is not valid",
        })
        .optional(),
      message: z.string(),
    })
    .refine(
      (data) => {
        const emailFilled = !!data.email;
        const phoneFilled = !!data.phone_number;
        return emailFilled !== phoneFilled;
      },
      {
        message: "Fill in either email or phone number, not both",
        path: ["email", "phone_number"],
      }
    );

  static query: ZodType = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    is_read: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean().optional()),
    search: z.string().optional(),
  });
}
