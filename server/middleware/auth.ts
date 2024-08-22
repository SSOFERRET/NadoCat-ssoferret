import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//[x]jwt 복호화
export const ensureAutorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("미들웨어 시작!!!!");


    const auth = req.headers["authorization"];
    console.log("auth------------: ", auth);

    if (auth && auth.startsWith("Bearer ")) {
      const receivedJwt = auth.substring(7);
      const decodedJwt = jwt.verify(
        receivedJwt,
        process.env.PRIVATE_KEY_GEN as string
      ) as JwtPayload;
      console.log("decodedJwt------------: ", decodedJwt);
      req.user = decodedJwt;
      next();
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "잘못된 JWT 형식입니다." });
    }
  } catch (error) {
    //수정부분
    console.error("Authorization error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
          message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
        });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "잘못된 토큰입니다." });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};
