import jwt from "jsonwebtoken";
// import { Response, NextFunction } from "express";
// import { ResponseError } from "@/error/response-error";
// import { UserRequest } from "@/type/user-request";
// import { toUserResponse, UserResponse } from "@/model/user-model";
// import { prismaClient } from "../application/database";
// import { verifyToken } from "@/util/jwt";

// export const authMiddleware = async (
//   req: UserRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       throw new ResponseError(401, "Unauthorized");
//     }

//     const userResponse = verifyToken(token) as UserResponse;
//     const user = await prismaClient.user.findUnique({
//       where: { id: userResponse.id },
//     });

//     if (!user) {
//       throw new ResponseError(401, "Unauthorized");
//     }

//     req.user = toUserResponse(user);
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Unauthorized" });
//   }
// };

import { Response, NextFunction } from "express";
import { ResponseError } from "../error/response-error";
import axios from "axios";
import { UserRequest } from "../type/user-request";
import { toUserResponse, UserResponse } from "../model/user-model";
import { prismaClient } from "@/application/database";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const headerAuthorization = req.header("Authorization");

  //   if (!headerAuthorization) {
  //     throw new ResponseError(401, "Unauthorized");
  //   }

  //   const response = await axios.get("http://localhost:4000/api/private/users/", {
  //     headers: {
  //       Authorization: headerAuthorization,
  //     },
  //   });

  //   const user = response.data.user;

  //   if (!user) {
  //     throw new ResponseError(401, "Unauthorized");
  //   }

  //   req.user = user as UserResponse;
  //   next();
  // } catch (error) {
  //   res.status(401).json({ error: "Unauthorized" });
  // }

  try {
    const headerAuthorization = req.header("Authorization");
    const token = headerAuthorization && headerAuthorization.split(" ")[1];

    if (!token) {
      throw new ResponseError(401, "Unauthorized");
    }

    const userResponse = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as UserResponse;

    const user = await prismaClient.user.findUnique({
      where: { id: userResponse.id },
    });

    if (!user) {
      throw new ResponseError(401, "Unauthorized");
    }

    req.user = toUserResponse(user);
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
