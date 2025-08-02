import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { CreateApbRequest, UpdateApbRequest } from "@/model/apb-model";
import { ApbValidation } from "@/validation/apb-validation";
import { Validation } from "@/validation/validation";

export class ApbService {
  static async getAll() {
    const apb = await prismaClient.apb.findMany({
      orderBy: {
        tahun: "desc",
      },
    });

    return { data: apb };
  }

  static async create(request: CreateApbRequest) {
    request.tahun = new Date();
    const validation = Validation.validate(ApbValidation.create, request);

    const apb = await prismaClient.apb.create({
      data: validation,
    });

    return { data: apb };
  }
  static async update(request: UpdateApbRequest, id: string) {
    const existingApb = await prismaClient.apb.findUnique({
      where: { id },
    });
    if (!existingApb) {
      throw new ResponseError(404, "APB not found");
    }

    const validation = Validation.validate(ApbValidation.update, request);

    const apb = await prismaClient.apb.update({
      where: { id },
      data: validation,
    });

    return { data: apb };
  }
  static async delete(id: string) {
    const existingApb = await prismaClient.apb.findUnique({
      where: { id },
    });
    if (!existingApb) {
      throw new ResponseError(404, "APB not found");
    }

    await prismaClient.apb.delete({
      where: { id },
    });
  }
}
