import { Organization } from "@prisma/client";
import z, { ZodType } from "zod";

export class MemberValidation {
  static createMember: ZodType = z.object({
    name: z.string({ message: "zodErrors.required" }),
    position: z.string({ message: "zodErrors.required" }),
    term_start: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" }),
    term_end: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" }),
    organization_type: z.nativeEnum(Organization, {
      message: "zodErrors.invalid_value",
    }),
    is_term: z.coerce.boolean({ message: "zodErrors.invalid_type" }),
    important_level: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" }),
  });

  static safeBoolean = z.preprocess((val) => {
    if (typeof val === "boolean") return val;

    if (typeof val === "string") {
      const lower = val.toLowerCase();
      if (lower === "true") return true;
      if (lower === "false") return false;
    }

    return undefined; // biar gagal validasi kalau bukan yang kita mau
  }, z.boolean({ message: "zodErrors.invalid_type" }));

  static updateMember: ZodType = z.object({
    name: z.string({ message: "zodErrors.invalid_type" }).optional(),
    position: z.string({ message: "zodErrors.invalid_type" }).optional(),
    term_start: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .optional(),
    term_end: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .optional(),
    organization_type: z
      .nativeEnum(Organization, { message: "zodErrors.invalid_value" })
      .optional(),
    is_term: this.safeBoolean.optional(),
    important_level: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .optional(),
  });
}
