import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ensureAutorization } from "../../middleware/auth";
import { myUser } from "../../model/my.model";

//[x]마이페이지
export const mypage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("my컨트롤러가 호출되었습니다.");

  try {
    console.log("req.user:", req.user); // 디버깅을 위해 로그 추가

    // user가 없는 경우 또는 user가 문자열일 경우 처리
    if (!req.user || typeof req.user === "string") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "사용자 정보가 없습니다.",
      });
    }

    //[ ]시작
    const uuid = req.user.uuid;
    console.log("uuid: ", uuid);

    //넘어온 uuid로 작업하면 됨
    const user = await myUser(uuid);
    console.log("사용자 정보: ", user);

    const userUuidString = user?.selectUser.uuid.toString("hex")

    return res.status(StatusCodes.OK).json({
      message: "마이페이지입니다.",
      user: {
        email: user?.selectUser.email,
        nickname: user?.selectUser.nickname,
        uuid: userUuidString,
      },
    });
  } catch (error) {
    console.error("에러 발생!!: ", error);
  }
};

//[ ]닉네임 변경
export const changeNickname = async (req: Request, res: Response) => {
  // const {uuid}
};

export const changepassword = async (req: Request, res: Response) => {};

export const changeProfile = async (req: Request, res: Response) => {};
