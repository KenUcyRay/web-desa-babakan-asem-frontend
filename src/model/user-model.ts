import { Role, User } from "@prisma/client";

export interface RegisterUserRequest {
  name: string;
  email?: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
  remember_me: boolean;
  recaptcha_token: string;
}

export interface LoginUserRequest {
  email?: string;
  phone_number?: string;
  password: string;
  remember_me: boolean;
  recaptcha_token: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: Role;
}

export interface UserForgotPasswordRequest {
  email: string;
}

export interface UserResetPasswordRequest {
  password: string;
  confirm_password: string;
}

export interface UserAllResponse {
  page: number;
  limit: number;
  total_page: number;
  users: UserResponse[];
}

export interface UserResponse {
  id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export const toUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export const toUserAllResponse = (
  page: number,
  limit: number,
  total: number,
  users: User[]
): UserAllResponse => {
  return {
    page: page,
    limit: limit,
    total_page: Math.ceil(total / limit),
    users: users.map(toUserResponse),
  };
};
