import { UserResponse } from "@/model/user-model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "rahasia_super_aman";

export function generateToken(payload: UserResponse, rememberMe: boolean) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: rememberMe ? "7d" : "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
