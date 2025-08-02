import { Organization } from "@prisma/client";
import z, { ZodType } from "zod";

export class MemberValidation {
  static createMember: ZodType = z.object({
    name: z.string(),
    position: z.string(),
    term_start: z.coerce.number().int(),
    term_end: z.coerce.number().int(),
    organization_type: z.nativeEnum(Organization),
    is_term: z.coerce.boolean(),
    important_level: z.coerce.number().int(),
  });

  static safeBoolean = z.preprocess((val) => {
    if (typeof val === "boolean") return val;

    if (typeof val === "string") {
      const lower = val.toLowerCase();
      if (lower === "true") return true;
      if (lower === "false") return false;
    }

    return undefined; // biar gagal validasi kalau bukan yang kita mau
  }, z.boolean());

  static updateMember: ZodType = z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    term_start: z.coerce.number().int().optional(),
    term_end: z.coerce.number().int().optional(),
    organization_type: z.nativeEnum(Organization).optional(),
    is_term: this.safeBoolean.optional(),
    important_level: z.coerce.number().int().optional(),
  });
}
