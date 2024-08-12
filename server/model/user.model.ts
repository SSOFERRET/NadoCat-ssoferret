import { PrismaClient } from "@prisma/client";
import bcryto from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

//[x]회원가입
export const createUser = async (email: string, nickname: string, password: string, authType: string) => {
  
  const hashing = async (password: string) => {
    const saltRound = 10;
    const salt = await bcryto.genSalt(saltRound);
    const hashPassword = await bcryto.hash(password, salt);
    return { salt, hashPassword };
  };

  const { salt, hashPassword } = await hashing(password);
  const uuid = uuidv4();
  const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");

  //DB저장
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          uuid: uuidBuffer,
          email: email,
          nickname: nickname,
          authType: "",
          status: "active", //default: active
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


//[x]로그인
export const loginUser = async (email: string, password: string, autoLogin: boolean) => {
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
      const selectUserSecrets = await prisma.userSecrets.findFirst({
        where: {
          uuid: userUuid,
        },
      });

      if (!selectUserSecrets) {
        console.log("사용자를 찾을 수 없습니다.");
        return null;
      }

      return { selectUsers, selectUserSecrets };
    });

    if (!result) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const { selectUsers, selectUserSecrets } = result; 
    const isPasswordValid = await bcryto.compare(password, selectUserSecrets.hashPassword); 

    if (!isPasswordValid) {
      throw new Error("사용자 정보가 일치하지 않습니다.");
    }

    const userUuidString = selectUsers.uuid.toString("hex").match(/.{1,4}/g) ?.join("-"); 
    const generalToken = jwt.sign(
      { 
        uuid: userUuidString,
        email: selectUsers.email
      }, process.env.PRIVATE_KEY_GEN as string, {
        expiresIn: "1m",
        issuer: "fefive"
      });

    let refreshToken: string | null = null;
    if(autoLogin){
      refreshToken = jwt.sign(
        { 
          uuid: userUuidString,
        }, process.env.PRIVATE_KEY_REF as string, {
          expiresIn: "7d",
          issuer: "fefive"
        }
      );
    }

   return {generalToken, refreshToken, result, userUuidString};

  } catch (error) {
    console.log("로그인 error:", error);
    throw new Error("로그인 중 오류 발생");
  }
};


//[ ] 자동로그인
export const saveRefreshToken = async (uuid: string , refreshToken: string) => {
    try {
      const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
      const selectUserSecrets = await prisma.user_secrets.findFirst({
        where: {
          uuid: uuidBuffer,
        },
      });

        const updateSecretUser = await prisma.user_secrets.update({
          data: {
            refresh_token: refreshToken
          },
          where: {
            userSecretId: selectUserSecrets?.userSecretId,
          },
        });

      return {selectUserSecrets, updateSecretUser};
    } catch (error) {
      console.log("자동로그인 error:", error);
      throw new Error("자동로그인 중 오류 발생");
    } 
}