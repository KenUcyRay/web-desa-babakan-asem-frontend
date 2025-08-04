import { prismaClient } from "@/application/database";
import {
  CreateVillageWorkProgramRequest,
  UpdateVillageWorkProgramRequest,
} from "./../model/village-work-program-model";
import { Validation } from "@/validation/validation";
import { VillageWorkProgramValidation } from "@/validation/village-work-program-validation";
import { ResponseError } from "@/error/response-error";
import { TFunction } from "i18next";
export class VillageWorkProgramService {
  static async getAll() {
    const programs = await prismaClient.villageWorkProgram.findMany({});

    return programs;
  }

  static async create(request: CreateVillageWorkProgramRequest) {
    const validation = Validation.validate(
      VillageWorkProgramValidation.create,
      request
    );

    const program = await prismaClient.villageWorkProgram.create({
      data: validation,
    });

    return { data: program };
  }

  static async update(
    t: TFunction,
    id: string,
    request: UpdateVillageWorkProgramRequest
  ) {
    const validation = Validation.validate(
      VillageWorkProgramValidation.update,
      request
    );

    const existingProgram = await prismaClient.villageWorkProgram.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      throw new ResponseError(404, t("village_work_program.not_found"));
    }

    const program = await prismaClient.villageWorkProgram.update({
      where: { id },
      data: validation,
    });

    return { data: program };
  }

  static async delete(t: TFunction, id: string) {
    const existingProgram = await prismaClient.villageWorkProgram.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      throw new ResponseError(404, t("village_work_program.not_found"));
    }

    await prismaClient.villageWorkProgram.delete({
      where: { id },
    });
  }
}
