import { Response } from "express";

export const setCookie = (
  res: Response,
  token: string,
  rememberMe: boolean
) => {
  const expired = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    maxAge: expired,
    path: "/",
    domain: undefined,
  };

  console.log("🍪 Setting cookie with options:", cookieOptions);
  res.cookie("token", token, cookieOptions);

  console.log("🍪 Cookie set successfully");
};

export const clearCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
  });
};
