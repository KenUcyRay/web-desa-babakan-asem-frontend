import fs from "fs/promises";
import path from "path";
import { Organization, Role } from "@prisma/client";
import { TFunction } from "i18next";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  MemberCreateRequest,
  MemberUpdateRequest,
} from "../model/member-model";
import { MemberValidation } from "../validation/member-validation";
import { Validation } from "../validation/validation";
import { UserResponse } from "@/model/user-model";

export class MemberService {
  static async getAll(
    organization?: Organization,
    page: number = 1,
    limit: number = 10
  ) {
    const members = await prismaClient.member.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        is_term: true,
        organization_type: organization ? organization : undefined,
      },
      orderBy: {
        important_level: "desc",
      },
    });
    const totalMembers = await prismaClient.member.count({
      where: {
        is_term: true,
        organization_type: organization ? organization : undefined,
      },
    });
    return {
      total_page: Math.ceil(totalMembers / limit),
      page,
      limit,
      members,
    };
  }
  static async getAllMembers(
    organization?: Organization,
    page: number = 1,
    limit: number = 10
  ) {
    const members = await prismaClient.member.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        organization_type: organization ? organization : undefined,
      },
      orderBy: {
        important_level: "desc",
      },
    });
    const totalMembers = await prismaClient.member.count({
      where: {
        organization_type: organization ? organization : undefined,
      },
    });
    return {
      total_page: Math.ceil(totalMembers / limit),
      page,
      limit,
      members,
    };
  }
  static async createMember(
    t: TFunction,
    request: MemberCreateRequest,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    const memberCreateRequest = Validation.validate(
      MemberValidation.createMember,
      request
    );

    if (
      user.role === Role.PKK &&
      memberCreateRequest.organization_type !== Organization.PKK
    ) {
      throw new ResponseError(403, t("member.pkk_only_member"));
    } else if (
      user.role === Role.KARANG_TARUNA &&
      memberCreateRequest.organization_type !== Organization.KARANG_TARUNA
    ) {
      throw new ResponseError(403, t("member.kt_only_member"));
    } else if (
      user.role === Role.BPD &&
      memberCreateRequest.organization_type !== Organization.BPD
    ) {
      throw new ResponseError(403, t("member.bpd_only_member"));
    } else if (user.role === Role.ADMIN) {
    } else {
      throw new ResponseError(403, t("member.admin_only_member"));
    }

    if (!file) {
      throw new ResponseError(400, t("member.profile_photo_required"));
    }

    const member = await prismaClient.member.create({
      data: {
        ...memberCreateRequest,
        profile_photo: file.filename,
      },
    });

    return { member: member };
  }
  static async updateMember(
    t: TFunction,
    request: MemberUpdateRequest,
    memberId: string,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    const memberUpdateRequest = Validation.validate(
      MemberValidation.updateMember,
      request
    );

    if (
      user.role === Role.PKK &&
      memberUpdateRequest.organization_type !== Organization.PKK
    ) {
      throw new ResponseError(403, t("member.pkk_only_member"));
    } else if (
      user.role === Role.KARANG_TARUNA &&
      memberUpdateRequest.organization_type !== Organization.KARANG_TARUNA
    ) {
      throw new ResponseError(403, t("member.kt_only_member"));
    } else if (
      user.role === Role.BPD &&
      memberUpdateRequest.organization_type !== Organization.BPD
    ) {
      throw new ResponseError(403, t("member.bpd_only_member"));
    } else if (user.role === Role.ADMIN) {
    } else {
      throw new ResponseError(403, t("member.admin_only_member"));
    }

    const existingMember = await prismaClient.member.findUnique({
      where: { id: memberId },
    });

    if (!existingMember) {
      throw new ResponseError(404, t("member.not_found"));
    }

    if (file) {
      memberUpdateRequest.profile_photo = file.filename;

      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "images",
        existingMember.profile_photo
      );

      await fs.unlink(filePath);
    } else {
      memberUpdateRequest.profile_photo = undefined;
    }

    const updatedMember = await prismaClient.member.update({
      where: { id: memberId },
      data: memberUpdateRequest,
    });

    return { member: updatedMember };
  }
  static async deleteMember(t: TFunction, memberId: string) {
    const existingMember = await prismaClient.member.findUnique({
      where: { id: memberId },
    });

    if (!existingMember) {
      throw new ResponseError(404, t("member.not_found"));
    }

    await prismaClient.member.delete({
      where: { id: memberId },
    });

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "images",
      existingMember.profile_photo
    );

    await fs.unlink(filePath);
  }
}
