import { Prisma } from "@prisma/client";
import { IMissingCreate, IMissingLocation, IMissingReport } from "../types/Missing";
import { IImageBridge } from "../types/image";
import { TCategoryId } from "../types/category";


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

export const addImageFormats = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  images: IImageBridge[]
) => {
  switch (categoryId) {
    case 3: return await tx.missingImages.createMany({
      data: images
    });
    case 4: return await tx.missingReportImages.createMany({
      data: images
    })
  }
}

export const addLocationFormats = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  location: IMissingLocation
) => {
  switch (categoryId) {
    case 3: return await tx.missingLocations.create({
      data: location
    });
    case 4: return await tx.missingReportLocations.create({
      data: location
    })
  }
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

export const addMissingReport = async (
  tx: Prisma.TransactionClient,
  missingReport: IMissingReport
) => {
  return await tx.missingReports.create({
    data: missingReport
  })
};