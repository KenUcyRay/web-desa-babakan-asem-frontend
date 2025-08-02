import { Role } from "@prisma/client";
import { z, ZodType } from "zod";

export class UserValidation {
  static register: ZodType = z
    .object({
      name: z.string().max(255),
      phone_number: z
        .string()
        .max(20)
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "Phone number is not valid",
        })
        .optional(),
      email: z.string().email().max(255).optional(),
      password: z.string().min(6).max(255),
      confirm_password: z.string().min(6).max(255),
      remember_me: z.boolean(),
      recaptcha_token: z.string(),
    })
    .refine(
      (data) => {
        const emailFilled = !!data.email;
        const phoneFilled = !!data.phone_number;
        return emailFilled !== phoneFilled;
      },
      {
        message: "Fill in either email or phone number, not both",
        path: ["email", "phone_number"],
      }
    )
    .refine((data) => data.password === data.confirm_password, {
      message: "Password and confirmation do not match",
      path: ["confirm_password"],
    });

  static login: ZodType = z
    .object({
      phone_number: z
        .string()
        .max(20)
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "Phone number is not valid",
        })
        .optional(),
      email: z.string().email().max(255).optional(),
      password: z.string().min(6).max(255),
      remember_me: z.boolean(),
      recaptcha_token: z.string(),
    })
    .refine(
      (data) => {
        const emailFilled = !!data.email;
        const phoneFilled = !!data.phone_number;
        return emailFilled !== phoneFilled;
      },
      {
        message: "Fill in either email or phone number, not both",
        path: ["email", "phone_number"],
      }
    );

  static forgotPassword: ZodType = z.object({
    email: z.string().email(),
  });

  static resetPassword: ZodType = z.object({
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  });

  static update: ZodType = z
    .object({
      name: z.string().max(255).optional(),
      phone_number: z
        .string()
        .max(20)
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "Phone number is not valid",
        })
        .optional(),
      email: z.string().email().max(255).optional(),
      password: z.string().min(6).max(255).optional(),
      confirm_password: z.string().min(6).max(255).optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Password and confirmation do not match",
      path: ["confirm_password"],
    });

  static createUser: ZodType = z.object({
    name: z.string().max(255),
    email: z.string().email().max(255).optional(),
    phone_number: z
      .string()
      .max(20)
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
        message: "Phone number is not valid",
      })
      .optional(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    role: z.nativeEnum(Role),
  });

  static updateRole: ZodType = z.nativeEnum(Role);
}
