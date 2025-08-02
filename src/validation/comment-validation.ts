import { TargetType } from "@prisma/client";
import z, { ZodType } from "zod";

export class CommentValidation {
  static create: ZodType = z.object({
    target_type: z.nativeEnum(TargetType),
    content: z.string(),
  });
  static update: ZodType = z.object({
    content: z.string(),
  });
}
