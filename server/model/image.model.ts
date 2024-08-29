import { Prisma } from "@prisma/client";
import prisma from "../client";

export const deleteImages = async (tx: Prisma.TransactionClient, imageIds: number[]) => {
  return await tx.images.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
};

export const addImage = async (tx: Prisma.TransactionClient, url: string) => {
  return await tx.images.create({
    data: {
      url,
    },
  });
};

export const getImageById = async (tx: Prisma.TransactionClient, imageId: number) => {
  return await tx.images.findUnique({
    where: {
      imageId,
    },
  });
};

export const addProfileImage = async (url: string, uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex");
  const user = await prisma.users.findFirst({
    where: { uuid: uuidBuffer },
  });

  if (!user) {
    console.error(`사용자를 찾을 수 없습니다. user: ${user}, uuid: ${uuid}`);
    return;
  }

  try {
    return await prisma.users.update({
      where: {
        uuid: uuidBuffer,
      },
      data: {
        profileImage: url,
      },
    });
  } catch (error) {
    console.error("프로필 이미지 업데이트 중 오류 발생:", error);
    throw error;
  }
};

export const deleteProfileImage = async (url: string, uuid: string) => {
  return await prisma.users.update({
    where: {
      uuid: Buffer.from(uuid, "hex"),
    },
    data: {
      profileImage: url,
    },
  });
};

export const getProfileImage = async (uuid: string) => {
  return await prisma.users.findFirst({
    where: {
      uuid: Buffer.from(uuid, "hex"),
    },
  });
};
