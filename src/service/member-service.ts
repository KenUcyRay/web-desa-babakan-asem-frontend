import fs from "fs/promises";
import path from "path";
import { Organization } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  MemberCreateRequest,
  MemberUpdateRequest,
} from "../model/member-model";
import { MemberValidation } from "../validation/member-validation";
import { Validation } from "../validation/validation";

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
    request: MemberCreateRequest,
    file?: Express.Multer.File
  ) {
    const memberCreateRequest = Validation.validate(
      MemberValidation.createMember,
      request
    );

    if (!file) {
      throw new ResponseError(400, "Profile photo is required");
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
    request: MemberUpdateRequest,
    memberId: string,
    file?: Express.Multer.File
  ) {
    const memberUpdateRequest = Validation.validate(
      MemberValidation.updateMember,
      request
    );

    const existingMember = await prismaClient.member.findUnique({
      where: { id: memberId },
    });

    if (!existingMember) {
      throw new ResponseError(404, "Member not found");
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
  static async deleteMember(memberId: string) {
    const existingMember = await prismaClient.member.findUnique({
      where: { id: memberId },
    });

    if (!existingMember) {
      throw new ResponseError(404, "Member not found");
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
