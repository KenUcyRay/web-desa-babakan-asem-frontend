import {
  PengantarCreateRequest,
  QueryAdministrationRequest,
  toAllAdministrationResponse,
} from "@/model/administration-model";
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
      data: { is_pending: false },
    });

    return { data: updatedPengantar };
  }

  static async getPengantar(query: QueryAdministrationRequest) {
    const queryValidation = Validation.validate(
      AdministrationValidation.query,
      query
    );

    const pengantar = await prismaClient.pengantar.findMany({
      skip: (queryValidation.page! - 1) * queryValidation.size!,
      take: queryValidation.size,
      where:
        queryValidation.isPending !== null
          ? { is_pending: queryValidation.isPending }
          : {},
    });

    const totalCount = await prismaClient.pengantar.count({
      where:
        queryValidation.isPending !== null
          ? { is_pending: queryValidation.isPending }
          : {},
    });

    return toAllAdministrationResponse(
      queryValidation.size!,
      totalCount,
      queryValidation.page!,
      pengantar
    );
  }

  static async pengantar(request: PengantarCreateRequest) {
    Validation.validate(AdministrationValidation.pengantar, request);

    const pengantar = await prismaClient.pengantar.create({
      data: request,
    });
    return { data: pengantar };
  }
}
