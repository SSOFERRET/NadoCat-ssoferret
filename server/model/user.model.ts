import { PrismaClient } from "@prisma/client";
import bcryto from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { indexOpensearchUser } from "../controller/search/Searches";


const prisma = new PrismaClient();

//[x]회원가입
export const createUser = async (email: string, nickname: string, password: string) => {

  const hashing = async (password: string) => {
    const saltRound = 10;
    const salt = await bcryto.genSalt(saltRound);
    const hashPassword = await bcryto.hash(password, salt);
    return { salt, hashPassword };
  };

  const { salt, hashPassword } = await hashing(password);
  const uuid = uuidv4();
  const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          uuid: uuidBuffer,
          email: email,
          nickname: nickname,
          authType: "general",
          status: "active",
        },
      });

      const secretUser = await prisma.userSecrets.create({
        data: {
          uuid: uuidBuffer,
          hashPassword: hashPassword,
          salt: salt,
        },
      });

      await indexOpensearchUser(email, nickname, uuidBuffer.toString("hex"));

      return { user, secretUser };
    });

    return result;

  } catch (error) {
    console.log("회원가입 error:", error);
    throw new Error("회원가입 중 오류 발생");
  }
};


//[x]로그인
export const loginUser = async (email: string, password: string, autoLogin: boolean) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const selectUser = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (!selectUser) {
        console.log("사용자를 찾을 수 없습니다.");
        return null;
      }

      const userUuid = selectUser.uuid;
      const selectUserSecret = await prisma.userSecrets.findFirst({
        where: {
          uuid: userUuid,
        },
      });

      if (!selectUserSecret) {
        console.log("사용자를 찾을 수 없습니다.");
        return null;
      }

      return { selectUser, selectUserSecret };
    });

    if (!result) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const { selectUser, selectUserSecret } = result;
    const isPasswordValid = await bcryto.compare(password, selectUserSecret.hashPassword);

    if (!isPasswordValid) {
      throw new Error("사용자 정보가 일치하지 않습니다.");
    }

    const userUuidString = selectUser.uuid.toString("hex").match(/.{1,4}/g)?.join("-");
    const generalToken = jwt.sign(
      {
        uuid: userUuidString,
        email: selectUser.email
      }, process.env.PRIVATE_KEY_GEN as string, {
      expiresIn: "1m",
      issuer: "fefive"
    });

    let refreshToken: string | null = null;
    if (autoLogin) {
      refreshToken = jwt.sign(
        {
          uuid: userUuidString,
        }, process.env.PRIVATE_KEY_REF as string, {
        expiresIn: "7d",
        issuer: "fefive"
      }
      );

      console.log("refreshToken왜 안나오냐:", refreshToken);

    }

    return { generalToken, refreshToken, result, userUuidString };

  } catch (error) {
    console.log("로그인 error:", error);
    throw new Error("로그인 중 오류 발생");
  }
};


//[x] 자동로그인(리프레시 토큰)
export const saveRefreshToken = async (uuid: string, refreshToken: string) => {
  try {
    const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
    const selectUserSecrets = await prisma.userSecrets.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    const updateSecretUser = await prisma.userSecrets.update({
      data: {
        refreshToken: refreshToken
      },
      where: {
        userSecretId: selectUserSecrets?.userSecretId,
      },
    });

    return { selectUserSecrets, updateSecretUser };
  } catch (error) {
    console.log("자동로그인 error:", error);
    throw new Error("자동로그인 중 오류 발생");
  }
};


//[ ] 카카오 로그인
export const kakaoUser = async (email: string, nickname: string, accessToken: string, refreshToken: string, tokenExpiry: string) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const selectUser = await prisma.users.findFirst({
        where: {
          email: email
        }
      });

      if (!selectUser) {
        const uuid = uuidv4();
        const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");

        const createUser = await prisma.users.create({
          data: {
            uuid: uuidBuffer,
            email: email,
            nickname: nickname,
            authType: "kakao",
            status: "active",
          },
        });

        const createUserOauthSecret = await prisma.userOauthSecrets.create({
          data: {
            uuid: uuidBuffer,
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenExpiry: tokenExpiry,
          },
        });

        return { createUser, createUserOauthSecret };
      }

      return selectUser;
    });

    return result;

  } catch (error) {
    console.log("카카오로그인 error:", error);
    throw new Error("카카오로그인 중 오류 발생");
  }


}