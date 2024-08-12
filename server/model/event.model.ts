import { Prisma } from "@prisma/client";
import prisma from "../client";
import { IEvent, IEventImage, IEventTag } from "../types/event";

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

  return events.map((event: IEvent) => {
    return {
      postId: event.postId,
      categoryId: event.categoryId,
      title: event.content,
      content: event.content,
      views: 0,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      isClosed: !!event.isClosed,
      users: {
        id: event?.users.id,
        uuid: (event?.users.uuid as Buffer).toString("hex"),
        nickname: event?.users.nickname,
        profileImage: event?.users.profileImage,
      },
      tags: event.eventTags.map((item: IEventTag) => item.tags),
      images: event.eventImages.map((item: IEventImage) => item.images),
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
    postId: true,
    categoryId: true,
    title: true,
    content: true,
    views: true,
    createdAt: true,
    updatedAt: true,
    users: {
      id: event?.users.id,
      uuid: (event?.users.uuid as Buffer).toString("hex"),
      nickname: event?.users.nickname,
      profileImage: event?.users.profileImage,
    },
    tags: event?.eventTags.map((item: IEventTag) => item.tags),
    images: event?.eventImages.map((item: IEventImage) => item.images),
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
