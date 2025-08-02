import { ResidentType } from "@prisma/client";

export interface QueryResidentRequest {
  type: ResidentType;
}

export interface UpdateResidentRequest {
  value: number;
}
