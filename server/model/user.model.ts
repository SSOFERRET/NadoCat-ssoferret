import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import connectRedis from "../redis"; 

const prisma = new PrismaClient();

export const createUser = async (email: string, nickname: string, password: string) => {

  const hashing = async (password: string) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    return { salt, hashPassword };
  };

  const { salt, hashPassword } = await hashing(password);
  const uuid = uuidv4();
  console.log("uuid원형: ", uuid);
  console.log("uuid하이픈제거: ", uuid.replace(/-/g, ""));

  const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");

  try {
    const selectUser = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (selectUser && selectUser.status === "active") {
      console.log("사용중인 이메일입니다.");
      return null;
    }

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          uuid: uuidBuffer,
          email: email,
          profileImage: "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png",
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


      return { user, secretUser };
    });

    return result;

  } catch (error) {
    console.log("회원가입 error:", error);
    throw new Error("회원가입 중 오류 발생");
  }
};


export const loginUser = async (email: string, password: string, autoLogin: boolean) => {
  const redisClient = await connectRedis();

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const selectUser = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (!selectUser || selectUser.status === "inactive") {
        console.log("사용자를 찾을 수 없습니다.");
        throw { status: StatusCodes.UNAUTHORIZED, message: "사용자를 찾을 수 없습니다." };
      }

      if (selectUser.authType === "kakao") {
        return { selectUser, selectUserSecret: null };
      }

      const userUuid = selectUser.uuid;
      const selectUserSecret = await prisma.userSecrets.findFirst({
        where: {
          uuid: userUuid,
        },
      });

      if (!selectUserSecret) {
        console.log("사용자를 찾을 수 없습니다.");
        throw { status: StatusCodes.UNAUTHORIZED, message: "사용자를 찾을 수 없습니다." };
      }

      return { selectUser, selectUserSecret };
    });

    if (!result) {
      throw { status: StatusCodes.UNAUTHORIZED, message: "사용자를 찾을 수 없습니다." };
    }

    const { selectUser, selectUserSecret } = result;

    if (selectUser.authType === "general") {
      if (!selectUserSecret || !selectUserSecret.hashPassword) {
        throw new Error("비밀번호가 설정되지 않은 사용자입니다.");
      }

      const isPasswordValid = await bcrypt.compare(password, selectUserSecret.hashPassword);
      if (!isPasswordValid) {
        throw new Error("사용자 정보가 일치하지 않습니다.");
      }

    }else {
      console.log("카카오 로그인 사용자");
    }


    const userUuidString = selectUser.uuid.toString("hex");
    const generalToken = jwt.sign(
      {
        uuid: userUuidString,
        email: selectUser.email
      }, process.env.PRIVATE_KEY_GEN as string, {
      expiresIn: process.env.GENERAL_TOKEN_EXPIRE_IN,
      issuer: "fefive"
    });

    let refreshToken: string | null = null;
    if (autoLogin === true) {
      refreshToken = jwt.sign(
        {
          uuid: userUuidString,
        }, process.env.PRIVATE_KEY_REF as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
        issuer: "fefive"
        }
      )
    }

    await redisClient.set(`uuid:${userUuidString}`, JSON.stringify({autoLogin: false}) , {EX: 3600 * 8 }); //8시간

    return { generalToken, refreshToken, result, userUuidString };

  } catch (error) {
    console.log("로그인 error:", error);
    throw new Error("로그인 중 오류 발생");
  }
};


export const saveRefreshToken = async (uuid: string, refreshToken: string) => {
  const redisClient = await connectRedis();
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

    await redisClient.set(`uuid:${uuidBuffer.toString("hex")}`, JSON.stringify({ autoLogin: true }), { EX: 7 * 24 * 60 * 60 });
    return { selectUserSecrets, updateSecretUser };
  } catch (error) {
    console.log("자동로그인 error:", error);
    throw new Error("자동로그인 중 오류 발생");
  }
};


export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.PRIVATE_KEY_REF as string) as jwt.JwtPayload;

    const uuidBuffer = Buffer.from(decoded.uuid.replace(/-/g, ""), "hex");
    const selectUser = await prisma.users.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    const selectUserSecrets = await prisma.userSecrets.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    if (!selectUser) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    if (!selectUserSecrets) {
      throw new Error("유효하지 않은 사용자입니다.");
    }

    const newAccessToken = jwt.sign(
      {
        uuid: decoded.uuid,
        email: selectUser.email
      }, process.env.PRIVATE_KEY_GEN as string, {
      expiresIn: process.env.GENERAL_TOKEN_EXPIRE_IN,
      issuer: "fefive"
    });

    return newAccessToken;

  } catch (error) {
    console.log("access token refresh error:", error);
    throw new Error("access token refresh 중 오류 발생");
  }
}

export const logoutUser = async (uuid: string) => {
  try {
    const redisClient = await connectRedis();
    const uuidBuffer = Buffer.from(uuid, "hex");

    await redisClient.del(`uuid:${uuidBuffer.toString("hex")}`); 
    await redisClient.del(`autoLogin:${uuidBuffer.toString("hex")}`); 

    const selectUserSecrets = await prisma.userSecrets.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    if (!selectUserSecrets) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const updateUserSecrets = await prisma.userSecrets.update({
      data: {
        refreshToken: ""
      },
      where: {
        userSecretId: selectUserSecrets?.userSecretId,
      },
    });

    return console.log("로그아웃 성공");

  } catch (error) {
    console.log("로그아웃:", error);
    throw new Error("로그아웃 중 오류 발생");
  }
}


//[x] 카카오 로그인
export const kakaoUser = async (email: string, nickname: string) => {
  const redisClient = await connectRedis();
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

        const createUserSecret = await prisma.userSecrets.create({
          data: {
            uuid: uuidBuffer,
            hashPassword: null, 
            salt: null 
          },
        });

        await redisClient.set(`uuid:${uuidBuffer.toString("hex")}`, JSON.stringify({ autoLogin: true }), { EX: 7 * 24 * 60 * 60 });
        return { createUser, createUserSecret };
      }

      const userUuidString = selectUser.uuid.toString("hex");
      const generalToken = jwt.sign(
        {
          uuid: userUuidString,
          email: selectUser.email
        }, process.env.PRIVATE_KEY_GEN as string, {
          expiresIn: process.env.GENERAL_TOKEN_EXPIRE_IN,
          issuer: "fefive"
        });
        
        await redisClient.set(`uuid:${userUuidString}`, JSON.stringify({ autoLogin: true }), { EX: 7 * 24 * 60 * 60 });
    
      let refreshToken: string | null = null;
      const selectUserSecrets = await prisma.userSecrets.findFirst({
        where: {
          uuid: selectUser.uuid
        }
      });


      if(selectUserSecrets){
        refreshToken = jwt.sign(
          {
            uuid: userUuidString,
          }, process.env.PRIVATE_KEY_REF as string, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
          issuer: "fefive"
        }
      );

        await prisma.userSecrets.update({
          data: {
            refreshToken: refreshToken 
          },
          where: {
            userSecretId: selectUserSecrets.userSecretId,
          },
        });
      }

      return {generalToken, refreshToken, nickname: selectUser.nickname, uuid: selectUser.uuid};
    });

    return result;

  } catch (error) {
    console.log("카카오로그인 error:", error);
    throw new Error("카카오로그인 중 오류 발생");
  }finally{
    await redisClient.quit();
  }
};
