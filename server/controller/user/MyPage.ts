import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import ensureAutorization from "../../utils/auth";

//[x]마이페이지
export const my = async (req: Request, res: Response) => {
  const authorization = ensureAutorization(req, res);
  console.log("authorization: ", authorization);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    return res.status(StatusCodes.OK).json({ message: "마이페이지입니다." });
  }
};

