import { z, ZodType } from "zod";

export class ActivityLogValidation {
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
  });
}
