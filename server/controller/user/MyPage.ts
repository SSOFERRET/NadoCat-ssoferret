import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ensureAutorization } from "../../middleware/auth";
import { getUser } from "../../model/my.model";
import multer from "multer";

//[x]마이페이지
export const mypage = async ( req: Request, res: Response, next: NextFunction) => {
  console.log("my컨트롤러가 호출되었습니다.");

//   const requestUuid = req.params.uuid;  // URL에서 가져온 UUID
//   const loginUuid = req.user?.uuid; // 로그인한 사용자의 UUID
//   console.log("요청 유저:", requestUuid);
//   console.log("로그인 유저:", loginUuid);

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
    const user = await getUser(uuid); // UUID로 URL 사용자 정보 가져오기
    // const user = await getUser(requestUuid); // UUID로 URL 사용자 정보 가져오기
    console.log("사용자 정보: ", user);

    if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({message: "사용자를 찾을 수 없습니다."});
    }

    // let userInfo;
    // if(loginUuid === requestUuid){
    //     //마이페이지
    //     userInfo = {
    //         email: user.selectUser.email,
    //         nickname: user.selectUser.nickname,
    //         profileImageUrl: user.selectUser.profileImage,
    //         uuid: loginUuid
    //     };
    // }else{
    //     //프로필
    //     userInfo = {
    //         nickname: user.selectUser.nickname,
    //         pprofileImageUrl: user.selectUser.profileImage,
    //         uuid: requestUuid
    //     };
    // }

    const userUuidString = user?.selectUser.uuid.toString("hex")

    return res.status(StatusCodes.OK).json({
      message: "마이페이지입니다.",
    //   user: userInfo,
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

export const updateNickname = async (req: Request, res: Response) => {
  // const {uuid}
};

export const updatePassword = async (req: Request, res: Response) => {
    
};

export const updateProfile = async (req: Request, res: Response) => {
    const upload = multer({
        dest: "uploads/"
    });
};

export const deleteProfile = async (req: Request, res: Response) => {
    const upload = multer({
        dest: "uploads/"
    });
};
