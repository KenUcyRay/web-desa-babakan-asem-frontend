import { PengantarType } from "@prisma/client";

export interface PengantarCreateRequest {
  name: string;
  nik: string;
  keterangan: string;
  type: PengantarType;
}
