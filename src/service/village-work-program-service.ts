import { prismaClient } from "@/application/database";
import {
  CreateVillageWorkProgramRequest,
  UpdateVillageWorkProgramRequest,
} from "./../model/village-work-program-model";
import { Validation } from "@/validation/validation";
import { VillageWorkProgramValidation } from "@/validation/village-work-program-validation";
import { ResponseError } from "@/error/response-error";
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

  static async update(id: string, request: UpdateVillageWorkProgramRequest) {
    const validation = Validation.validate(
      VillageWorkProgramValidation.update,
      request
    );

    const existingProgram = await prismaClient.villageWorkProgram.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      throw new ResponseError(404, "Village work program not found");
    }

    const program = await prismaClient.villageWorkProgram.update({
      where: { id },
      data: validation,
    });

    return { data: program };
  }

  static async delete(id: string) {
    const existingProgram = await prismaClient.villageWorkProgram.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      throw new ResponseError(404, "Village work program not found");
    }

    await prismaClient.villageWorkProgram.delete({
      where: { id },
    });
  }
}
