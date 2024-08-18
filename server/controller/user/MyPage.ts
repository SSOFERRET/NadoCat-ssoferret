import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ensureAutorization } from "../../middleware/auth";

//[x]마이페이지
export const my = async (req: Request, res: Response, next: NextFunction) => {
    console.log("my컨트롤러가 호출되었습니다.");
  const authorization = ensureAutorization(req, res, next);
  console.log("authorization: ", authorization);

  // user가 없는 경우 또는 user가 문자열일 경우 처리
  if (!req.user || typeof req.user === "string") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "사용자 정보가 없습니다.",
    });
  }

  const uuid = req.user.uuid;
  console.log("uuid: ", uuid);

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
