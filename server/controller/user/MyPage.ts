import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ensureAutorization } from "../../middleware/auth";

//[x]마이페이지
export const my = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("my컨트롤러가 호출되었습니다.");
    console.log("req.user:", req.user); // 디버깅을 위해 로그 추가

    // user가 없는 경우 또는 user가 문자열일 경우 처리
    if (!req.user || typeof req.user === "string") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "사용자 정보가 없습니다.",
      });
    }


      console.log("마이페이지에 잘 접근중!!");
      const uuid = req.user.uuid;
      console.log("uuid: ", uuid);
    

    return res.status(StatusCodes.OK).json({ message: "마이페이지입니다." });
    
  } catch (error) {
    console.error("에러 발생!!: ", error);
  }
};
