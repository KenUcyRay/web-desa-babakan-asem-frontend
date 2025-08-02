import { Request } from "express";
import { UserResponse } from "../model/user-model";

export interface UserRequest extends Request {
  user?: UserResponse;
}
