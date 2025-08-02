import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { Validation } from "@/validation/validation";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserAllResponse,
  toUserResponse,
  UpdateUserRequest,
  UserCreateRequest,
  UserForgotPasswordRequest,
  UserResetPasswordRequest,
  UserResponse,
} from "@/model/user-model";
import { generateToken } from "@/util/jwt";
import { UserValidation } from "@/validation/user-validation";
import { TFunction } from "i18next";
import { transporter } from "@/application/nodemailer";
import axios from "axios";
import { Role } from "@prisma/client";
import { verifyRecaptcha } from "@/util/recaptcha";

export class UserService {
  static async register(request: RegisterUserRequest) {
    Validation.validate(UserValidation.register, request);

    const success = verifyRecaptcha(request.recaptcha_token);
    if (!success) {
      throw new ResponseError(403, "Recaptcha verification failed");
    }

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

    const success = verifyRecaptcha(request.recaptcha_token);
    if (!success) {
      throw new ResponseError(403, "Recaptcha verification failed");
    }

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
        reset_token_expiry: new Date(Date.now() + 3600000),
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

  static async getById(userId: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ResponseError(404, "User not found");
    }
    return { user: toUserResponse(user) };
  }

  static async getUser(user: UserResponse) {
    const userFind = await prismaClient.user.findUnique({
      where: { id: user.id },
    });

    if (!userFind) {
      throw new ResponseError(404, "User not found");
    }

    return { user: toUserResponse(userFind) };
  }
  static async update(user: UserResponse, request: UpdateUserRequest) {
    Validation.validate(UserValidation.update, request);

    const userFind = await prismaClient.user.findUnique({
      where: { id: user.id },
    });

    if (!userFind) {
      throw new ResponseError(404, "User not found");
    }

    if (request.password) {
      request.password = await bcryptjs.hash(request.password, 10);
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

    return { user: toUserResponse(userUpdate) };
  }
  static async delete(user: UserResponse, token: string) {
    if (user.role === "ADMIN") {
      await Promise.all([
        axios.delete("http://localhost:4000/api/admin/news/delete-by-admin", {
          headers: {
            Authorization: token,
          },
        }),
        axios.delete("http://localhost:4000/api/admin/agenda/delete-by-admin", {
          headers: {
            Authorization: token,
          },
        }),
        axios.delete(
          "http://localhost:4000/api/admin/products/delete-by-admin",
          {
            headers: {
              Authorization: token,
            },
          }
        ),
        axios.delete(
          "http://localhost:4000/api/private/comments/delete-by-user",
          {
            headers: {
              Authorization: token,
            },
          }
        ),
      ]);
    } else if (user.role === "REGULAR") {
      await axios.delete(
        "http://localhost:4000/api/private/comments/delete-by-user",
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }

    await prismaClient.user.delete({
      where: { id: user.id },
    });
  }

  static async getAllUser(page: number = 1, limit: number = 10) {
    const users = await prismaClient.user.findMany({
      where: {
        NOT: {
          role: Role.REGULAR,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalUser = await prismaClient.user.count({
      where: {
        NOT: {
          role: Role.REGULAR,
        },
      },
    });

    return toUserAllResponse(page, limit, totalUser, users);
  }
  static async createUser(request: UserCreateRequest) {
    Validation.validate(UserValidation.createUser, request);

    if (request.password !== request.confirm_password) {
      throw new ResponseError(
        400,
        "Password and confirm password do not match"
      );
    }

    const userWithSameEmail = await prismaClient.user.count({
      where: {
        email: request.email,
      },
    });

    if (userWithSameEmail !== 0) {
      throw new ResponseError(400, "Email already exists");
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

    return { user: toUserResponse(userCreate) };
  }
  static async updateRole(userId: string, role: Role) {
    Validation.validate(UserValidation.updateRole, role);

    const userFind = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFind) {
      throw new ResponseError(404, "User not found");
    }

    console.log(userFind.role, role);
    if (userFind.role === role) {
      throw new ResponseError(400, "User already has this role");
    }

    const userUpdateRole = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    return { user: toUserResponse(userUpdateRole) };
  }
}
