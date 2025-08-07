import { SiteContentType } from "@prisma/client";
import { z, ZodType } from "zod";

export class SiteContentValidation {
  static create: ZodType = z
    .object({
      key: z
        .string()
        .min(1, "site_content.key_required")
        .max(255, "site_content.key_max_length"),
      value_id: z.string().optional(),
      value_en: z.string().optional(),
      type: z.nativeEnum(SiteContentType, {
        message: "site_content.type_invalid",
      }),
    })
    .strict()
    .refine(
      (data) => {
        const isMedia =
          data.type === SiteContentType.IMAGE ||
          data.type === SiteContentType.VIDEO;
        if (!isMedia) {
          return !!data.value_id && data.value_id.trim().length > 0;
        }
        return true;
      },
      {
        message: "site_content.value_id_required",
        path: ["value_id"],
      }
    )
    .refine(
      (data) => {
        const isMedia =
          data.type === SiteContentType.IMAGE ||
          data.type === SiteContentType.VIDEO;
        if (!isMedia) {
          return !!data.value_en && data.value_en.trim().length > 0;
        }
        return true;
      },
      {
        message: "site_content.value_en_required",
        path: ["value_en"],
      }
    );

  static update: ZodType = z
    .object({
      key: z.string().optional(),
      value_id: z.string().optional(),
      value_en: z.string().optional(),
      type: z.nativeEnum(SiteContentType, {
        message: "site_content.type_invalid",
      }),
    })
    .strict()
    .refine(
      (data) => {
        const isImage = data.type === SiteContentType.IMAGE;

        if (!isImage) {
          const valueIdFilled = !!data.value_id && data.value_id.trim() !== "";
          const valueEnFilled = !!data.value_en && data.value_en.trim() !== "";

          if (
            (valueIdFilled && !valueEnFilled) ||
            (!valueIdFilled && valueEnFilled)
          ) {
            return false;
          }
        }

        return true;
      },
      {
        message:
          "value_id and value_en must both be filled if one is provided (except for IMAGE type)",
        path: ["value_en", "value_id"],
      }
    );

  static query: ZodType = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
    type: z.nativeEnum(SiteContentType).optional(),
    search: z.string().optional(),
  });
}
