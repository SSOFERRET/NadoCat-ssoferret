import { PrismaClient, Prisma } from "@prisma/client";
import bcryto from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { indexOpensearchUser } from "../controller/search/Searches";
import { deleteProfileImages } from "../util/images/deleteImages";
import { addProfileImages } from "../util/images/addNewImages";

const prisma = new PrismaClient();

//[ ]마이페이지
export const getUser = async (uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    //사용자 정보 가져오기
    const selectUser = await prisma.users.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    if (!selectUser) {
      //사실 자기정보라 이러면 안되긴 함
      console.log("사용자를 찾을 수 없습니다.");
      return null;
    }

    return { selectUser };
  } catch (error) {
    console.log("마이페이지 사용자 조회 error:", error);
    throw new Error("마이페이지 사용자 조회에서 오류 발생");
  }
};

export const updateUser = async (uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    // 사용자 정보 업데이트
    const updateUser = await prisma.users.update({
      where: {
        uuid: uuidBuffer,
      },
      data: {
        nickname: "테스트",
      },
    });

    return {updateUser}
  } catch (error) {
    console.log("마이페이지 사용자 정보 업데이트 error:", error);
    throw new Error("마이페이지 사용자 정보 업데이트에서 오류 발생");
  }
};

export const deleteUser = async (uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    // 사용자 삭제(inactive로 상태변경)
    const deleteUser = await prisma.users.update({
      where: {
        uuid: uuidBuffer,
      },
      data: {
        status: "inactive",
      },
    });

    return {deleteUser}
  } catch (error) {
    console.log("마이페이지 사용자 삭제 error:", error);
    throw new Error("마이페이지 사용자 삭제에서 오류 발생");
  }
};

//프로필 이미지 저장 로직 추가
export const addProfileImageFormats = async (
  uuid: string,
  imageUrl: string
) => {
  await addProfileImages(imageUrl, uuid);
};

//프로필 이미지 삭제 로직 추가(기본이미지 변경)
export const deleteProfileImageFormats = async (
    uuid: string,
    imageUrl: string
  ) => {
    await deleteProfileImages(imageUrl, uuid);
  };
  
