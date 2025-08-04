import { TargetType } from "@prisma/client";
import z, { ZodType } from "zod";

export class CommentValidation {
  static create: ZodType = z.object({
    target_type: z.nativeEnum(TargetType, {
      message: "zodErrors.invalid_value",
    }),
    content: z.string({ message: "zodErrors.required" }),
  });
  static update: ZodType = z.object({
    content: z.string({ message: "zodErrors.required" }),
  });
}
