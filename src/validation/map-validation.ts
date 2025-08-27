import { MapType } from "@prisma/client";
import { z, ZodType } from "zod";

export class MapValidation {
  static createMap: ZodType = z
    .object({
      type: z.nativeEnum(MapType, { message: "zodErrors.invalid_value" }),
      name: z.string().min(1, { message: "zodErrors.required" }),
      description: z.string().min(1, { message: "zodErrors.required" }),
      year: z.coerce.number().min(1900, { message: "zodErrors.min_value" }),
      coordinates: z
        .any()
        .transform((val, ctx) => {
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val);
              return parsed;
            } catch (error) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "zodErrors.invalid_coordinates_format",
              });
              return z.NEVER;
            }
          }
          return val;
        })
        .pipe(z.union([z.array(z.number()), z.array(z.array(z.number()))])),
      color: z.string().optional().refine((val) => {
        if (!val) return true;
        const isValid = /^#[0-9A-Fa-f]{6}$/.test(val);
        console.log('Color validation:', val, 'isValid:', isValid);
        return isValid;
      }, { message: "Color must be valid hex" }),
      radius: z.coerce.number().min(100, { message: "Radius must be 100-5000" }).max(5000, { message: "Radius must be 100-5000" }).optional(),
    })
    .strict();

  static updateMap: ZodType = z
    .object({
      type: z.nativeEnum(MapType, { message: "zodErrors.invalid_value" }),
      name: z.string().min(1, { message: "zodErrors.required" }),
      description: z.string().min(1, { message: "zodErrors.required" }),
      year: z.coerce.number().min(1900, { message: "zodErrors.min_value" }),
      coordinates: z
        .any()
        .transform((val, ctx) => {
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val);
              return parsed;
            } catch (error) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "zodErrors.invalid_coordinates_format",
              });
              return z.NEVER;
            }
          }
          return val;
        })
        .pipe(z.union([z.array(z.number()), z.array(z.array(z.number()))])),
      color: z.string().optional().refine((val) => {
        if (!val) return true;
        const isValid = /^#[0-9A-Fa-f]{6}$/.test(val);
        console.log('Color validation:', val, 'isValid:', isValid);
        return isValid;
      }, { message: "Color must be valid hex" }),
      radius: z.coerce.number().min(100, { message: "Radius must be 100-5000" }).max(5000, { message: "Radius must be 100-5000" }).optional(),
    })
    .strict();
}
