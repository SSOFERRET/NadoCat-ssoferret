import { Prisma } from "@prisma/client";
import { IMissingCreate } from "../types/Missing";
import { IImageBridge } from "../types/image";

export const addMissing = async (
  tx: Prisma.TransactionClient,
  missing: IMissingCreate
) => {
  return await tx.missings.create({
    data: missing
  });
}

export const addMissingImages = async (
  tx: Prisma.TransactionClient,
  images: IImageBridge[]
) => {
  return await tx.missingImages.createMany({
    data: images
  });
}

export const getMissing = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missings.findUnique({
    where: {
      postId
    }
  })
}