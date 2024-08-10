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
