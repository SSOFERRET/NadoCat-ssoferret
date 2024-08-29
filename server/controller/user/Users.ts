import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";

import axios from "axios";
import {
  createUser,
  loginUser,
  saveRefreshToken,
  kakaoUser,
  refreshAccessToken,
  logoutUser,
} from "../../model/user.model";
import { IUsers, IUserSecrets } from "../../types/user";
import prisma from "../../client";
import connectRedis from "../../redis";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;

  try {
    const result = await createUser(email, nickname, password);

    if (result === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "이미 사용 중인 이메일입니다." });
    }

    return res.status(StatusCodes.CREATED).json({
      message: "회원가입 성공!",
      user: {
        id: result.user.id,
        userId: result.user.uuid,
        email: result.user.email,
        nickname: result.user.nickname,
        authtype: result.user.authType,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
  } 
};

export const login = async (req: Request, res: Response) => {
  const { email, password, autoLogin } = req.body;
  const isAutoLogin = (autoLogin === 'true' || autoLogin === true); 
  const generalTokenMaxAge = parseInt(process.env.GENERAL_TOKEN_MAX_AGE || '28800000'); // 8시간
  const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE || "604800000");// 7일
  // const generalTokenMaxAge = 1 * 60 * 1000; // 1분
  // const refreshTokenMaxAge = 3 * 60 * 1000;// 3분
  // const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;// 7일


  try {
    const { generalToken, refreshToken, result, userUuidString } = await loginUser(email, password, autoLogin);

    if (!userUuidString || (!refreshToken && autoLogin)) {
      throw new Error("유효하지 않은 값입니다.");
    }

    res.cookie("generalToken", generalToken, {
      httpOnly: true,
      secure: true,
      maxAge: generalTokenMaxAge,
    });

    if (isAutoLogin) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: refreshTokenMaxAge,
      });

      await saveRefreshToken(userUuidString, refreshToken as string);
    }

    return res.status(StatusCodes.OK).json({
      message: "로그인 성공",
      user: {
        email: result.selectUser.email,
        nickname: result.selectUser.nickname,
        uuid: userUuidString,
      },
      tokens: {
        accessToken: generalToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error("로그인 error:", error);
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 처리 중 오류가 발생했습니다." });
  }
};

export const getNewAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken; 

  if (!refreshToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token이 존재하지 않습니다." });
  }

  try {
    const newAccessToken = await refreshAccessToken(refreshToken);
    return res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("로그인 error:", error);
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "유효하지 않은 Refresh token입니다." });
  } 
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.body;
    if (!uuid) {
      return res.status(400).json({ message: "UUID가 없습니다." });
    }

    await logoutUser(uuid);

    res.clearCookie("generalToken", { httpOnly: true, secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.clearCookie("uuid", { httpOnly: true, secure: true });
    return res.status(200).json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error("로그아웃 에러:", error);
    return res.status(500).json({ message: "로그아웃 중 오류 발생" });
  } 
};

//[ ]카카오
export const kakao = async (req: Request, res: Response) => {
  const generalTokenMaxAge = 30 * 60 * 1000; // 30분
  const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7일
  const { code } = req.query;
  try {
    const tokenResponse = await axios.post(
      process.env.KAKAO_TOKEN_URL as string,
      {},
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get(process.env.KAKAO_USERINFO_URL as string, 

      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

    const { properties, kakao_account } = userResponse.data;
    const kakaoEmail = kakao_account.email;
    const kakaoNickname = properties.nickname;

    const result = await kakaoUser(kakaoEmail, kakaoNickname);
    if (!result || !result.uuid) {
      throw new Error("유효하지 않은 사용자입니다.");
    }

    const userUuidString = result.uuid.toString("hex");

    res.cookie("generalToken", result.generalToken, {
      httpOnly: true,
      secure: true,
      maxAge: generalTokenMaxAge,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: refreshTokenMaxAge,
    });

    // res.redirect(`http://localhost:5173/users/auth/kakao-redirect?code=${code}&uuid=${userUuidString}`);
    res.redirect(`http://3.37.238.147/users/auth/kakao-redirect?code=${code}&uuid=${userUuidString}`);

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "카카오 로그인 실패",
      error: error,
    });
  } 
};

export const storeLoginData = async(req: Request, res: Response) => {
  const { uuid, isAutoLogin } = req.body;
  const redisClient = await connectRedis();

  try {
    await redisClient.set(`uuid:${uuid}`, JSON.stringify({ isAutoLogin }),{
      EX: isAutoLogin ? 7 * 24 * 60 * 60 : 8 * 60 * 60,  
    });

    return res.status(StatusCodes.OK).json({ 
      message: "데이터 저장 성공" ,
      uuid: uuid
    }); 

  } catch (error) {
    console.error("Redis 데이터 저장 중 오류 발생:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
  }
}

export const getUuid = async(req: Request, res: Response) => {
  const redisClient = await connectRedis();
  const uuidKey = req.user?.uuid 

  try {
    console.log(`Fetching uuid with key: uuid:${uuidKey}`); 
    const uuidData = await redisClient.get(`uuid:${uuidKey}`);
    if(!uuidData) {
      console.log("UUID를 찾을 수 없습니다."); 
      return res.status(StatusCodes.NOT_FOUND).json({ message: "UUID를 찾을 수 없습니다." });
    }

    console.log(`Fetched uuid data: ${uuidData}`);
    const uuid = JSON.parse(uuidData).uuid;

    return res.status(StatusCodes.OK).json({ uuid: uuid });

  } catch (error) {
    console.error("Redis 데이터 저장 중 오류 발생:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
  } finally {
    redisClient.quit(); 
  }
}

