import { Prisma } from "@prisma/client";
import { IMissingCreate, IMissingReport } from "../types/missing";
import { IImageBridge } from "../types/image";
import { TCategoryId } from "../types/category";
import { IListData, IPostData } from "../types/post";
import { ILocationBridge } from "../types/location";
import prisma from "../client";


export const addMissing = async (
  tx: Prisma.TransactionClient,
  missing: IMissingCreate
) => {
  return await tx.missings.create({
    data: missing
  });
}

export const getPostList = async (
  listData: IListData
): Promise<any> => {
  const { limit, cursor, orderBy, categoryId } = listData;
  switch (categoryId) {
    case 3: return await getMissingsList(listData);
    case 4: return await getMissingReportsList(listData);
  }
};

const getMissingsList = async (
  listData: IListData
) => {
  const { limit, cursor, orderBy } = listData;

  const fetchMissingsByFoundStatus = async (
    foundStatus: number,
    limit: number,
    cursor?: number
  ) => {
    return await prisma.missings.findMany({
      where: {
        found: foundStatus,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { postId: cursor } : undefined,
      orderBy: [
        {
          [orderBy.sortBy]: orderBy.sortOrder,
        },
        {
          postId: "desc",
        },
      ],
    });
  };
  const unfoundList = await fetchMissingsByFoundStatus(0, limit, cursor);
  const remainingLimit = limit - unfoundList.length;
  let foundList = remainingLimit > 0 ? await fetchMissingsByFoundStatus(1, remainingLimit, cursor) : [];

  const posts = [...unfoundList, ...foundList];

  let nextCursor = null;

  if (posts.length === limit) {
    const lastPost = posts[posts.length - 1];
    nextCursor = lastPost.postId;
  }

  return { posts, nextCursor };
}

const getMissingReportsList = async (
  listData: IListData
) => {
  const { limit, cursor, orderBy } = listData;

  const fetchMissingReportsByFoundStatus = async (
    matchStatus: string,
    limit: number,
    cursor?: number
  ) => {
    return await prisma.missingReports.findMany({
      where: {
        match: matchStatus
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { postId: cursor } : undefined,
      orderBy: [
        {
          [orderBy.sortBy]: orderBy.sortOrder,
        },
        {
          postId: "desc",
        },
      ],
    });
  };
  const matchList = await fetchMissingReportsByFoundStatus("Y", limit, cursor);
  let remainingLimit = limit - matchList.length;
  const checkingList = remainingLimit > 0 ? await fetchMissingReportsByFoundStatus("-", remainingLimit, cursor) : [];

  const posts = [...matchList, ...checkingList];

  remainingLimit = limit - posts.length;

  const unmatchList = await fetchMissingReportsByFoundStatus("N", limit, cursor);

  let nextCursor = null;

  if (posts.length === limit) {
    const lastPost = posts[posts.length - 1];
    nextCursor = lastPost.postId;
  }

  return { posts, nextCursor };
}

export const getPostsCount = async (
  categoryId: TCategoryId
) => {
  switch (categoryId) {
    case 3: return await prisma.missings.count();
    case 4: return await prisma.missingReports.count();
    default: return new Error("잘못된 카테고리 ID");
  }
};

export const removePost = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
) => {
  switch (postData.categoryId) {
    case 3: return await tx.missings.delete({
      where: {
        postId: postData.postId,
        categoryId: postData.categoryId
      }
    });
    case 4: return await tx.missingReports.delete({
      where: {
        postId: postData.postId,
        categoryId: postData.categoryId
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
  location: ILocationBridge
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
  postData: IPostData
) => {
  switch (postData.categoryId) {
    case 3: return await tx.missingImages.deleteMany({
      where: {
        postId: postData.postId
      }
    });
    case 4: return await tx.missingReportImages.deleteMany({
      where: {
        postId: postData.postId
      }
    });
  }
}

export const deleteLocationFormats = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
) => {
  switch (postData.categoryId) {
    case 3: return await tx.missingLocations.deleteMany({
      where: {
        postId: postData.postId
      }
    });
    case 4: return await tx.missingReportLocations.deleteMany({
      where: {
        postId: postData.postId
      }
    });
  }
}

export const getPostByPostId = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
): Promise<any> => {
  switch (postData.categoryId) {
    case 3: return await tx.missings.findUnique({
      where: {
        postId: postData.postId
      }
    });
    case 4: return await tx.missingReports.findUnique({
      where: {
        postId: postData.postId
      }
    });
  }
}

export const getLocationFormatsByPostId = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
) => {
  switch (postData.categoryId) {
    case 3: return await tx.missingLocations.findMany({
      where: {
        postId: postData.postId
      }
    })
    case 4: return await tx.missingReportLocations.findMany({
      where: {
        postId: postData.postId
      }
    })
  }
};

export const getImageFormatsByPostId = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
) => {
  switch (postData.categoryId) {
    case 3: return await tx.missingImages.findMany({
      where: {
        postId: postData.postId
      }
    });
    case 4: return await tx.missingReportImages.findMany({
      where: {
        postId: postData.postId
      }
    })
  }
};

export const getMissingReportsByMissingId = async (
  tx: Prisma.TransactionClient,
  missingId: number
) => {
  return await tx.missingReports.findMany({
    where: {
      missingId
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

export const updateMissingReportByPostId = async (
  tx: Prisma.TransactionClient,
  postId: number,
  uuid: Buffer,
  detail: string,
  time: Date
) => {
  return await tx.missingReports.update({
    where: {
      postId,
      uuid
    },
    data: {
      time,
      detail
    }
  })
}

export const updateFoundByPostId = async (
  tx: Prisma.TransactionClient,
  postData: IPostData,
  found: boolean
) => {
  return await tx.missings.update({
    where: {
      uuid: postData.userId,
      postId: postData.postId
    },
    data: {
      found: Number(found)
    }
  })
}

export const updateMissingReportCheckByPostId = async (
  tx: Prisma.TransactionClient,
  postData: IPostData,
  match: string
) => {
  return await tx.missingReports.update({
    where: {
      uuid: postData.userId,
      postId: postData.postId
    },
    data: {
      match
    }
  })
}