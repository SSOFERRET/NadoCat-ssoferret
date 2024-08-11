import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
import bcryto from "bcrypt";
// import crypto from "crypto";

const uuid = uuidv4();
const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
console.log("uuidBuffer:", uuidBuffer);
const prisma = new PrismaClient();

//[x]회원가입
export const signup = async (req: Request, res: Response) => {
  const { email, nickname, password, authtype } = req.body;

  const hashing = async (password: string) => {
    const saltRound = 10;
    const salt = await bcryto.genSalt(saltRound);

    const hashPassword = await bcryto.hash(password, salt);
    return { salt, hashPassword };
  };

  //DB저장
  try {
    const { salt, hashPassword } = await hashing(password);

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          uuid: uuidBuffer,
          email: email,
          nickname: nickname,
          auth_type: authtype,
          status: "active", //default: active
        },
      });

      const secretUser = await prisma.user_secrets.create({
        data: {
          uuid: uuidBuffer,
          hash_password: hashPassword,
          salt: salt,
        },
      });

      return { user, secretUser };
    });

    //변환 확인용으로 넣음
    const userUuidString = result.user.uuid
      .toString("hex")
      .match(/.{1,4}/g)
      ?.join("-");
    console.log("userUuidString:", userUuidString);

    if (result.user && result.secretUser) {
      return res.status(StatusCodes.CREATED).json({
        message: "회원가입 성공!",
        user: {
          id: result.user.id,
          userId: result.user.uuid,
          email: result.user.email,
          nickname: result.user.nickname,
          // authtype: result.user.auth_type
        },
      });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "회원가입 실패!" });
    }
  } catch (error) {
    console.log("회원가입 error:", error);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

//[x]로그인
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const selectUsers = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (!selectUsers) {
        console.log("사용자를 찾을 수 없습니다.");
        return null;
      }

      const userUuid = selectUsers.uuid; 
      const selectUserSecrets = await prisma.user_secrets.findFirst({
        where: {
          uuid: userUuid,
        },
      });

      if (!selectUserSecrets) {
        console.log("사용자를 찾을 수 없습니다.");
        return null;
      }

      return { selectUsers, selectUserSecrets };
    })

    if (!result) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "사용자를 찾을 수 없습니다." });
    }

    const { selectUsers, selectUserSecrets } = result; 
    const isPasswordValid = await bcryto.compare(
      password,
      selectUserSecrets.hash_password
    ); 

    if (!isPasswordValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "사용자 정보가 일치하지 않습니다." });
    }

    const userUuidString = selectUsers.uuid.toString("hex").match(/.{1,4}/g) ?.join("-"); 
    const token = jwt.sign(
      { 
        uuid: userUuidString,
        email: selectUsers.email
      }, process.env.PRIVATE_KEY as string, {
        expiresIn: "1m",
        issuer: "fefive"
      });

      res.cookie("token", token, {
        httpOnly: true
      });

    return res.status(StatusCodes.OK).json({
      message: "로그인 성공",
      user: {
        email: selectUsers.email,
        nickname: selectUsers.nickname,
        password: selectUserSecrets.hash_password,
        uuid: userUuidString,
      },
    });
  } catch (error) {
    console.log("로그인 error:", error);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

//::카카오
export const kakao = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.json({ email: email, password: password });
};

//::구글
export const google = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.json({ email: email, password: password });
};
