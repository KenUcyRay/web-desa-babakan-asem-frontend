import { PengantarType } from "@prisma/client";
import { z, ZodType } from "zod";

export class AdministrationValidation {
  static pengantar: ZodType = z.object({
    name: z.string().min(1, "Name is required"),
    nik: z.string().min(1, "NIK is required"),
    keterangan: z.string().min(1, "Keterangan is required"),
    type: z.nativeEnum(PengantarType),
  });
}
