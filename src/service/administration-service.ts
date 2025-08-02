import { PengantarCreateRequest } from "@/model/administration-model";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Validation } from "@/validation/validation";
import { AdministrationValidation } from "@/validation/administration-validation";

export class AdministrationService {
  static async updatePengantar(id: string) {
    const pengantarExists = await prismaClient.pengantar.findUnique({
      where: { id },
    });
    if (!pengantarExists) {
      throw new ResponseError(404, "Pengantar request not found");
    }

    const updatedPengantar = await prismaClient.pengantar.update({
      where: { id },
      data: { is_pending: false }, // Example update, adjust as needed
    });

    return { pengantar: updatedPengantar };
  }

  static async getPengantar(
    page: number,
    limit: number,
    isPending: boolean | null
  ) {
    const pengantar = await prismaClient.pengantar.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: isPending !== null ? { is_pending: isPending } : {},
    });

    const totalCount = await prismaClient.pengantar.count({
      where: isPending !== null ? { is_pending: isPending } : {},
    });

    return {
      total_page: Math.ceil(totalCount / limit),
      page,
      limit,
      data: pengantar,
    };
  }

  static async pengantar(request: PengantarCreateRequest) {
    Validation.validate(AdministrationValidation.pengantar, request);

    const pengantar = await prismaClient.pengantar.create({
      data: request,
    });
    return { pengantar: pengantar };
  }
}
