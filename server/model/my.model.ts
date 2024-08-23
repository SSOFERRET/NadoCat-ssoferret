import { PrismaClient, Prisma } from "@prisma/client";
import bcryto from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { indexOpensearchUser } from "../controller/search/Searches";
import { IImage, IProfileImageBridge } from "../types/image";

const prisma = new PrismaClient();

//[ ]마이페이지 
export const myUser = async (uuid: string) => {
    try {
        //사용자 정보 가져오기
        const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
        const selectUser = await prisma.users.findFirst({
            where: {
                uuid: uuidBuffer,
            },
        });

        if(!selectUser){ //사실 자기정보라 이러면 안되긴 함
            console.log("사용자를 찾을 수 없습니다.");
            return null;
        }

        //사용자 정보 업데이트
        // const updateUser = await prisma.users.update({
        //     where: {
        //         uuid: uuidBuffer,
        //     },
        //     data: {
        //         nickname: "테스트"
        //     }
        // });

        //사용자 삭제(inactive로 상태변경)
        // const deleteUser = await prisma.users.update({
        //     where: {
        //         uuid: uuidBuffer,
        //     },
        //     data: {
        //         status: "inactive"
        //     }
        // });

        return {selectUser};

    } catch (error) {
        console.log("마이페이지 error:", error);
        throw new Error("마이페이지에서 오류 발생");
    }
}

//프로필 이미지 저장 로직 추가
export const addProfileImageFormats = async (
    tx: Prisma.TransactionClient, 
    image: IProfileImageBridge) => {
        return await tx.userImages.create({ data: image });
  };