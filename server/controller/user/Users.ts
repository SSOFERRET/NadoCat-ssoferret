import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
// import crypto from "crypto";
import { createUser, loginUser, saveRefreshToken} from "../../model/user.model";
import { IUsers, IUserSecrets } from "../../types/user";

//[x]회원가입
export const signup = async (req: Request, res: Response) => {
  const { email, nickname, password, authtype } = req.body;

  //DB저장
  try {
    const result: {user: IUsers, secretUser: IUserSecrets} = await createUser(email, nickname, password, authtype);

    if (result.user && result.secretUser) {
      return res.status(StatusCodes.CREATED).json({
        message: "회원가입 성공!",
        user: {
          id: result.user.id,
          userId: result.user.uuid,
          email: result.user.email,
          nickname: result.user.nickname,
          authtype: result.user.authType
        },
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "회원가입 실패!" });
    }

  } catch (error) {
    console.log("회원가입 error:", error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
  }
};


//[x]로그인
export const login = async (req: Request, res: Response) => {
  const { email, password, autoLogin } = req.body;
  const isAutoLogin = (autoLogin === 'true' || autoLogin === true);

  try {
    const {generalToken, refreshToken, result, userUuidString} = await loginUser(email, password, autoLogin); 
    console.log("autoLogin상태: ", autoLogin);

    if(!userUuidString || (!refreshToken && autoLogin)){
      console.log("유효하지 않은 UUID 또는 Refresh Token입니다.");
      throw new Error("유효하지 않은 값입니다.");
    }

      res.cookie("generalToken", generalToken, {
        httpOnly: true
      });

      if(isAutoLogin){ //자동로그인시
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 3 * 60 * 1000 //3분
          // maxAge: 7 * 24 * 60 * 60 * 1000 //7일
        });

        //refresh token DB 저장
        await saveRefreshToken(userUuidString, refreshToken as string);   
      }

    return res.status(StatusCodes.OK).json({
      message: "로그인 성공",
      user: {
        email: result.selectUsers.email,
        nickname: result.selectUsers.nickname,
        password: result.selectUserSecrets.hashPassword,
        uuid: userUuidString,
      },
      tokens: {
        accessToken: generalToken,
        refreshToken: refreshToken
      }
    });
    
  } catch (error) {
    console.log("로그인 error:", error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "로그인 처리 중 오류가 발생했습니다." });
  }
};

//[ ]카카오
export const kakao = async (req: Request, res: Response) => {
  const { code } = req.query; //response_type=code → code로 고정, url에서 읽어올거

  //토큰요청
  // const resType = await axios({
  //   grant_type
  // })



  const { email, password } = req.body;
  const kakaoAuthUrl = process.env.KAKAO_AUTH_URL;




  return res.json({ email: email, password: password });
};

//::구글
export const google = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.json({ email: email, password: password });
};
