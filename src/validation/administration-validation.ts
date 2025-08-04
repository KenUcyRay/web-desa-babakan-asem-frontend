import { PengantarType } from "@prisma/client";
import { z, ZodType } from "zod";

export class AdministrationValidation {
  static pengantar: ZodType = z.object({
    name: z.string().min(1, "Name is required"),
    nik: z.string().min(1, "NIK is required"),
    keterangan: z.string().min(1, "Keterangan is required"),
    type: z.nativeEnum(PengantarType),
  });

  static query: ZodType = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    isPending: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean().optional()),
  });
}
