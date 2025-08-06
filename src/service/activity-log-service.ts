import { prismaClient } from "@/application/database";
import {
  QueryActivityLogRequet,
  toAllActivityLogResponse,
} from "@/model/activity-log-validation";
import { ActivityLogValidation } from "@/validation/activity-log-validation";
import { Validation } from "@/validation/validation";

export class ActivityLogService {
  static async getAll(query: QueryActivityLogRequet) {
    const queryValidation = Validation.validate(
      ActivityLogValidation.query,
      query
    );

    const logs = await prismaClient.activityLog.findMany({
      skip: (queryValidation.page! - 1) * queryValidation.size!,
      take: queryValidation.size,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalLog = await prismaClient.activityLog.count({});
    return toAllActivityLogResponse(
      queryValidation.size!,
      totalLog,
      queryValidation.page!,
      logs
    );
  }
}
