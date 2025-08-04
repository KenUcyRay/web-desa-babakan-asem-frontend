import { UpdateRoleUserRequest } from "./../model/user-model";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { TFunction, use } from "i18next";
import axios from "axios";
import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { Validation } from "@/validation/validation";
import {
  CreateUserRequest,
  LoginUserRequest,
  QueryUser,
  RegisterUserRequest,
  toUserAllResponse,
  toUserResponse,
  UpdateUserRequest,
  UserForgotPasswordRequest,
  UserResetPasswordRequest,
  UserResponse,
} from "@/model/user-model";
import { generateToken } from "@/util/jwt";
import { UserValidation } from "@/validation/user-validation";
import { transporter } from "@/application/nodemailer";
import { Role } from "@prisma/client";
import { verifyRecaptcha } from "@/util/recaptcha";

export class UserService {
  static async register(request: RegisterUserRequest) {
    Validation.validate(UserValidation.register, request);

    // const success = await verifyRecaptcha(request.recaptcha_token);
    // if (!success) {
    //   throw new ResponseError(403, "Recaptcha verification failed");
    // }

    const findUserWithSameEmaiOrPhone = await prismaClient.user.count({
      where: {
        email: request.email ?? undefined,
        phone_number: request.phone_number ?? undefined,
      },
    });

    if (findUserWithSameEmaiOrPhone !== 0) {
      throw new ResponseError(400, "Email or phone number already registered");
    }

    request.password = await bcryptjs.hash(request.password, 10);
    const user = await prismaClient.user.create({
      data: {
        name: request.name,
        email: request.email ?? null,
        phone_number: request.phone_number ?? null,
        password: request.password,
        role: "REGULAR",
      },
    });

    const userResponse = toUserResponse(user);
    const token = generateToken(userResponse, request.remember_me);

    return {
      token: token,
      user: userResponse,
    };
  }
  static async login(t: TFunction, request: LoginUserRequest) {
    Validation.validate(UserValidation.login, request);

    // const success = await verifyRecaptcha(request.recaptcha_token);
    // if (!success) {
    //   throw new ResponseError(403, "Recaptcha verification failed");
    // }

    const user = await prismaClient.user.findFirst({
      where: {
        email: request.email ?? undefined,
        phone_number: request.phone_number ?? undefined,
      },
    });

    if (!user || !(await bcryptjs.compare(request.password, user.password))) {
      throw new ResponseError(400, t("user.cannot_login"));
    }

    const userResponse = toUserResponse(user);

    const token = generateToken(userResponse, request.remember_me);

    return {
      token: token,
      user: userResponse,
    };
  }
  static async delete(user: UserResponse) {
    await prismaClient.user.delete({
      where: { id: user.id },
    });

    await prismaClient.news.deleteMany({
      where: { userId: user.id },
    });
    await prismaClient.agenda.deleteMany({
      where: { userId: user.id },
    });
    await prismaClient.product.deleteMany({
      where: { user_id: user.id },
    });
    await prismaClient.comment.deleteMany({
      where: { user_id: user.id },
    });
  }
  static async profile(user: UserResponse) {
    const userFind = await prismaClient.user.findUnique({
      where: { id: user.id },
    });
    return { data: toUserResponse(userFind!) };
  }
  static async update(user: UserResponse, request: UpdateUserRequest) {
    Validation.validate(UserValidation.update, request);

    if (request.password) {
      request.password = await bcryptjs.hash(request.password, 10);
    }
    if (request.email && user.email === null) {
      throw new ResponseError(
        400,
        "You cannot update email because you already have phone number"
      );
    }
    if (request.phone_number && user.phone_number === null) {
      throw new ResponseError(
        400,
        "You cannot update phone number because you already have email"
      );
    }

    if (request.email) {
      const emailExists = await prismaClient.user.count({
        where: {
          email: request.email,
          id: { not: user.id },
        },
      });

      if (emailExists !== 0) {
        throw new ResponseError(400, "Email already registered");
      }
    }
    if (request.phone_number) {
      const phoneExists = await prismaClient.user.count({
        where: {
          phone_number: request.phone_number,
          id: { not: user.id },
        },
      });

      if (phoneExists !== 0) {
        throw new ResponseError(400, "Phone number already registered");
      }
    }
    const userUpdate = await prismaClient.user.update({
      where: { id: user.id },
      data: {
        ...(request.name && { name: request.name }),
        ...(request.email && { email: request.email }),
        ...(request.phone_number && { phone_number: request.phone_number }),
        ...(request.password && { password: request.password }),
      },
    });

    return { data: toUserResponse(userUpdate) };
  }
  static async getAllUser(user: UserResponse, query: QueryUser) {
    const queryValidation = Validation.validate(
      UserValidation.queryUser,
      query
    );

    const users = await prismaClient.user.findMany({
      where: {
        AND: [
          {
            role: queryValidation.role
              ? queryValidation.role
              : { not: Role.REGULAR },
          },
          { id: { not: user.id } },
        ],
      },
      skip: (queryValidation.page! - 1) * queryValidation.size!,
      take: queryValidation.size,
    });
    const totalUser = await prismaClient.user.count({
      where: {
        AND: [
          {
            role: queryValidation.role
              ? queryValidation.role
              : { not: Role.REGULAR },
          },
          { id: { not: user.id } },
        ],
      },
    });
    return toUserAllResponse(
      queryValidation.size!,
      totalUser,
      queryValidation.page!,
      users
    );
  }
  static async createUser(request: CreateUserRequest) {
    Validation.validate(UserValidation.createUser, request);

    const findUserWithSameEmaiOrPhone = await prismaClient.user.count({
      where: {
        email: request.email ?? undefined,
        phone_number: request.phone_number ?? undefined,
      },
    });

    if (findUserWithSameEmaiOrPhone !== 0) {
      throw new ResponseError(400, "Email or phone number already registered");
    }

    request.password = await bcryptjs.hash(request.password, 10);

    const userCreate = await prismaClient.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: request.password,
        role: request.role,
      },
    });

    return { data: toUserResponse(userCreate) };
  }
  static async updateRole(id: string, request: UpdateRoleUserRequest) {
    Validation.validate(UserValidation.updateRole, request);

    const userFind = await prismaClient.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userFind) {
      throw new ResponseError(404, "User not found");
    }

    if (userFind.role === request.role) {
      throw new ResponseError(400, "User already has this role");
    }

    const userUpdateRole = await prismaClient.user.update({
      where: {
        id: id,
      },
      data: {
        role: request.role,
      },
    });

    return { data: toUserResponse(userUpdateRole) };
  }

  static async forgotPassword(request: UserForgotPasswordRequest) {
    Validation.validate(UserValidation.forgotPassword, request);

    const user = await prismaClient.user.findFirst({
      where: { email: request.email },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const token = jwt.sign(
      toUserResponse(user),
      process.env.JWT_SECRET_KEY_RESET!,
      {
        expiresIn: "1h",
      }
    );

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        reset_token: token,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: '"App Support" ranggadendiakun@gmail.com',
      to: request.email,
      subject: "Reset Password Desa Babakan Asem Conggeang",
      html: `<p>Klik link ini untuk reset password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
  }

  static async verifyResetToken(token: string) {
    console.log("Verifying reset token:", token);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_RESET!);
    } catch (error) {
      throw new ResponseError(400, "Invalid or expired token");
    }
    decoded = decoded as UserResponse;
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }
  }

  static async resetPassword(request: UserResetPasswordRequest, token: string) {
    Validation.validate(UserValidation.resetPassword, request);

    if (request.password !== request.confirm_password) {
      throw new ResponseError(400, "Passwords do not match");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_RESET!);
    } catch (error) {
      throw new ResponseError(400, "Invalid or expired token");
    }
    decoded = decoded as UserResponse;
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const hashedPassword = await bcryptjs.hash(request.password, 10);

    await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
