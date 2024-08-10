import { Prisma } from "@prisma/client";
import { IMissingCreate, IMissingLocation } from "../types/Missing";
import { IImageBridge } from "../types/image";

export const addMissing = async (
  tx: Prisma.TransactionClient,
  missing: IMissingCreate
) => {
  return await tx.missings.create({
    data: missing
  });
}

export const removeMissing = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missings.delete({
    where: {
      postId,
      categoryId: 3
    }
  })
}

export const addMissingImages = async (
  tx: Prisma.TransactionClient,
  images: IImageBridge[]
) => {
  return await tx.missingImages.createMany({
    data: images
  });
}

export const addMissingLocation = async (
  tx: Prisma.TransactionClient,
  location: IMissingLocation
) => {
  return await tx.missingLocations.create({
    data: location
  });
};

export const deleteMissingImages = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missingImages.deleteMany({
    where: {
      postId
    }
  })
}

export const deleteMissingLocations = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missingLocations.deleteMany({
    where: {
      postId
    }
  })
}

export const getMissingByPostId = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missings.findUnique({
    where: {
      postId
    }
  })
}

export const getMissingLocationsByPostId = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missingLocations.findMany({
    where: {
      postId
    }
  })
};

export const getMissingImagesByPostId = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missingImages.findMany({
    where: {
      postId
    }
  })
};

export const getMissingReportsByPostId = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missingReports.findMany({
    where: {
      postId
    }
  })
};