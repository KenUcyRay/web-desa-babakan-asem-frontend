import { Response } from "express";

export const setCookie = (
  res: Response,
  token: string,
  rememberMe: boolean
) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
