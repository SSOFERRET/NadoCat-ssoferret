import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ensureAutorization } from "../../middleware/auth";
import { getUser } from "../../model/my.model";
import multer from "multer";
import { uploadSingleImageToS3, deleteSingleImageToS3 } from "../../util/images/s3ImageHandler";
import { addProfileImage, deleteProfileImage,getProfileImage } from "../../model/image.model";

//[x]마이페이지
export const mypage = async ( req: Request, res: Response, next: NextFunction) => {
  console.log("my컨트롤러가 호출되었습니다.");

  const requestUuid = req.params.uuid;  // URL에서 가져온 UUID
  const loginUuid = req.user?.uuid; // 로그인한 사용자의 UUID
  console.log("요청 유저:", requestUuid);
  console.log("로그인 유저:", loginUuid);

  try {
    console.log("req.user:", req.user); // 디버깅을 위해 로그 추가

    //사용자 정보 가져오기
    const user = await getUser(requestUuid); // UUID로 URL 사용자 정보 가져오기
    console.log("사용자 정보: ", user);
    if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({message: "사용자를 찾을 수 없습니다."});
    }
  
    let userInfo;
    if(loginUuid === requestUuid){
        //마이페이지
        userInfo = {
            email: user.selectUser.email,
            nickname: user.selectUser.nickname,
            profileImageUrl: user.selectUser.profileImage,
            uuid: loginUuid,
        };
    }else{
        //프로필
        userInfo = {
            nickname: user.selectUser.nickname,
            pprofileImageUrl: user.selectUser.profileImage,
            uuid: requestUuid
        };
    }

    return res.status(StatusCodes.OK).json({
      message: "마이페이지입니다.",
      user: userInfo,
    });
  } catch (error) {
    console.error("에러 발생!!: ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "마이페이지에서 서버 오류가 발생했습니다." });
  };
};



export const updateNickname = async (req: Request, res: Response) => {
  // const {uuid}
};

export const updatePassword = async (req: Request, res: Response) => {
    
};



export const updateProfile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "이미지가 업로드되지 않았습니다." });
        }

        // 기존 프로필 이미지 URL을 가져오기 (검증 및 삭제용)
        const user = await getProfileImage(req.user.uuid);
        const defaultUrl = "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png";
        const oldProfileImageUrl = user?.profileImage || "";

        // 새 프로필 업로드
        const newImageUrl = await uploadSingleImageToS3(req);
        if (!newImageUrl) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "이미지 url을 가져오는데 실패했습니다." });
        }

        // DB에 추가
        await addProfileImage(newImageUrl, req.user.uuid);

        // 클라이언트에 새로운 이미지 URL을 응답
        res.status(StatusCodes.OK).json({ message: "이미지가 업데이트 되었습니다.", imageUrl: newImageUrl });

        // 기존 이미지 삭제 작업 비동기로 처리
        if (oldProfileImageUrl && oldProfileImageUrl !== defaultUrl) {
            deleteSingleImageToS3(oldProfileImageUrl)
                .then(() => console.log("기존 이미지 삭제 완료"))
                .catch((err) => console.error("기존 이미지 삭제 중 오류 발생:", err));
        }
    } catch (error) {
        console.error("프로필 이미지 업데이트 중 오류 발생:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류가 발생했습니다." });
    }
};




//기존에 e3에서 삭제하고 다시 db에 기본경로 저장
export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const user = await getProfileImage(req.user.uuid); //user 조회
        const currentProfileImageUrl = user?.profileImage; // 사용자의 현재 프로필 이미지 URL을 가져옵니다.
        console.log("현재이미지: ", currentProfileImageUrl);

        if (!currentProfileImageUrl) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "삭제할 프로필 이미지가 없습니다."});
        }

        const imageUrl = await deleteSingleImageToS3(currentProfileImageUrl);  // 기존 이미지를 삭제
        await deleteProfileImage(req.body.imageUrl, req.user.uuid); // DB에서 기본 이미지 URL로 업데이트
        return res.status(StatusCodes.OK).json({message: "이미지가 기본으로 변경 되었습니다.", imageUrl: imageUrl });

    } catch (error) {
        console.error("프로필 이미지 삭제 중 오류 발생:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

