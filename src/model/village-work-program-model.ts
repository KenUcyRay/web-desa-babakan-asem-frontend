import { VillageWorkProgramStatus } from "@prisma/client";

export interface CreateVillageWorkProgramRequest {
  description: string;
  date: Date;
  status: VillageWorkProgramStatus;
  justification: string;
  budget_amount: number;
}

export interface UpdateVillageWorkProgramRequest {
  description?: string;
  date?: Date;
  status?: VillageWorkProgramStatus;
  justification?: string;
  budget_amount?: number;
}
