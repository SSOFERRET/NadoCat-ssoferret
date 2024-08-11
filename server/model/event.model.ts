import { Prisma } from "@prisma/client";
import prisma from "../client";

export const getEventList = async (
  categoryId: number,
  limit: number,
  orderBy: { sortBy: string; sortOrder: string },
  cursor: number | undefined
) => {
  const events = await prisma.events.findMany({
    where: {
      categoryId: categoryId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { postId: cursor } : undefined,
    orderBy: [
      {
        [orderBy.sortBy]: orderBy.sortOrder,
      },
      {
        postId: "asc",
      },
    ],

    select: {
      postId: true,
      categoryId: true,
      title: true,
      content: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      isClosed: true,
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        },
      },
      eventImages: {
        select: {
          images: {
            select: {
              imageId: true,
              url: true,
            },
          },
        },
      },
      eventTags: {
        select: {
          tags: {
            select: {
              tagId: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  return events.map((event: any) => {
    return {
      ...event,
      users: {
        id: event?.users.id,
        uuid: (event?.users.uuid as Buffer).toString("hex"),
        nickname: event?.users.nickname,
        profileImage: event?.users.profileImage,
      },
      eventTags: event.eventTags.map((item: any) => item.tags),
      eventImages: event.eventImages.map((item: any) => item.images),
    };
  });
};

export const getEventById = async (postId: number, categoryId: number) => {
  const event = await prisma.events.findUnique({
    where: {
      postId: postId,
      categoryId: categoryId,
    },
    select: {
      postId: true,
      categoryId: true,
      title: true,
      content: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        },
      },
      eventImages: {
        select: {
          images: {
            select: {
              imageId: true,
              url: true,
            },
          },
        },
      },
      eventTags: {
        select: {
          tags: {
            select: {
              tagId: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  return {
    ...event,
    users: {
      id: event?.users.id,
      uuid: (event?.users.uuid as Buffer).toString("hex"),
      nickname: event?.users.nickname,
      profileImage: event?.users.profileImage,
    },
    eventTags: event?.eventTags.map((item: any) => item.tags),
    eventImages: event?.eventImages.map((item: any) => item.images),
  };
};

export const addEvent = async (
  tx: Prisma.TransactionClient,
  userId: string,
  title: string,
  content: string,
  isClosed: boolean,
  date: string,
  categoryId: number
) =>
  await tx.events.create({
    data: {
      title,
      content,
      isClosed: isClosed ? 1 : 0,
      categoryId,
      uuid: Buffer.from(userId, "hex"),
      date,
    },
  });

export const updateEventById = async (
  tx: Prisma.TransactionClient,
  userId: string,
  postId: number,
  title: string,
  content: string,
  isClosed: boolean,
  date: string,
  categoryId: number
) => {
  return await tx.events.update({
    where: {
      postId,
      uuid: Buffer.from(userId, "hex"),
      categoryId: categoryId,
    },
    data: {
      title,
      content,
      isClosed: isClosed ? 1 : 0,
      date,
    },
  });
};

export const removeEventById = async (
  tx: Prisma.TransactionClient,
  postId: number,
  userId: string,
  categoryId: number
) => {
  return await tx.events.delete({
    where: {
      postId: postId,
      uuid: Buffer.from(userId, "hex"),
      categoryId: categoryId,
    },
  });
};

export const addEventTags = async (
  tx: Prisma.TransactionClient,
  tags: {
    postId: number;
    tagId: number;
  }[]
) => {
  return await tx.eventTags.createMany({
    data: tags,
  });
};

export const addEventImages = async (
  tx: Prisma.TransactionClient,
  images: {
    postId: number;
    imageId: number;
  }[]
) => {
  return await tx.eventImages.createMany({
    data: images,
  });
};

export const deleteEventTagByTagIds = async (
  tx: Prisma.TransactionClient,
  tagIds: number[]
) => {
  return await tx.eventTags.deleteMany({
    where: {
      tagId: {
        in: tagIds,
      },
    },
  });
};

// export const deleteCommunityTagByTagId = async (
//   tx: Prisma.TransactionClient,
//   tagId: number
// ) => {
//   return await tx.communityTags.delete({
//     where: {
//       tagId: tagId,
//     },
//   });
// };

// export const deleteCommunityByPostIds = async (
//   tx: Prisma.TransactionClient,
//   postIds: number[]
// ) => {
//   return await tx.communityTags.deleteMany({
//     where: {
//       postId: {
//         in: postIds,
//       },
//     },
//   });
// };

export const deleteEventImagesByImageIds = async (
  tx: Prisma.TransactionClient,
  imageIds: number[]
) => {
  return await tx.eventImages.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
};
