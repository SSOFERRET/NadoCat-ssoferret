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

export const removePost = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  switch (categoryId) {
    case 3: return await tx.missings.delete({
      where: {
        postId,
        categoryId
      }
    });
    case 4: return await tx.missingReports.delete({
      where: {
        postId,
        categoryId
      }
    });
  }
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

export const deleteImageFormats = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  switch (categoryId) {
    case 3: return await tx.missingImages.deleteMany({
      where: {
        postId
      }
    });
    case 4: return await tx.missingReportImages.deleteMany({
      where: {
        postId
      }
    });
  }

}

export const deleteLocationFormats = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  switch (categoryId) {
    case 3: return await tx.missingLocations.deleteMany({
      where: {
        postId
      }
    });
    case 4: return await tx.missingReportLocations.deleteMany({
      where: {
        postId
      }
    });
  }
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

export const getLocationFormatsByPostId = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  switch (categoryId) {
    case 3: return await tx.missingLocations.findMany({
      where: {
        postId
      }
    })
    case 4: return await tx.missingReportLocations.findMany({
      where: {
        postId
      }
    })
  }
};

export const getImageFormatsByPostId = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  switch (categoryId) {
    case 3: return await tx.missingImages.findMany({
      where: {
        postId
      }
    });
    case 4: return await tx.missingReportImages.findMany({
      where: {
        postId
      }
    })
  }
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

export const updateMissingByPostId = async (
  tx: Prisma.TransactionClient,
  postId: number,
  uuid: Buffer,
  catId: number,
  detail: string,
  time: Date
) => {
  return await tx.missings.update({
    where: {
      postId,
      uuid
    },
    data: {
      catId,
      time,
      detail
    }
  })
}