import { Prisma } from "@prisma/client";

export const deleteImages = async (
  tx: Prisma.TransactionClient,
  imageIds: number[]
) => {
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

export const getImageById = async (
  tx: Prisma.TransactionClient,
  imageId: number
) => {
  return await tx.images.findUnique({
    where: {
      imageId,
    },
  });
};

//프로필 이미지 변경
export const addProfileImage = async (
  tx: Prisma.TransactionClient,
  url: string,
  uuid: string
) => {
  return await tx.users.update({
    where: {
      uuid: Buffer.from(uuid, "hex"),
    },
    data: {
      profileImage: url,
    },
  });
};

//프로필 이미지 삭제
export const deleteProfileImage = async (
  tx: Prisma.TransactionClient,
  url: string,
  uuid: string
) => {
  return await tx.users.update({
    where: {
      uuid: Buffer.from(uuid, "hex"),
    },
    data: {
      profileImage: "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png",
    },
  });
};
