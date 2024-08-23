import { Prisma } from "@prisma/client";
import prisma from "../client";
import { IEvent, IEventImage, IEventTag } from "../types/event";
import { CATEGORY } from "../constants/category";
import { getOrderBy } from "../util/sort/orderBy";
import { SortOrder } from "../types/sort";

export const getEventsCount = async () => await prisma.events.count();

export const getEventList = async (limit: number, sort: string, cursor: number | undefined) => {
  const categoryId = CATEGORY.EVENTS;
  const orderBy = getOrderBy(sort);
  const orderOptions = [];

  if (orderBy.sortBy === "likes") {
    orderOptions.push({
      eventLikes: {
        _count: orderBy.sortOrder as SortOrder,
      },
    });
  } else {
    orderOptions.push({
      [orderBy.sortBy]: orderBy.sortOrder as SortOrder,
    });
  }
  const events = await prisma.events.findMany({
    where: {
      categoryId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { postId: cursor } : undefined,
    orderBy: orderOptions,
    include: {
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        },
      },
      eventImages: {
        take: 1,
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
      _count: {
        select: {
          eventLikes: true,
        },
      },
    },
  });

  return events.map((event: IEvent) => {
    return {
      postId: event.postId,
      categoryId: event.categoryId,
      title: event.title,
      content: event.content,
      views: event.views,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      isClosed: event.isClosed,
      users: {
        id: event?.users.id,
        uuid: (event?.users.uuid as Buffer).toString("hex"),
        nickname: event?.users.nickname,
        profileImage: event?.users.profileImage,
      },
      tags: event.eventTags.map((item: IEventTag) => item.tags),
      thumbnail: event.eventImages.map((item: IEventImage) => item.images.url).join("") ?? null,
      likes: event._count.eventLikes,
    };
  });
};

export const getEventById = async (postId: number) => {
  const categoryId = CATEGORY.EVENTS;
  const event = await prisma.events.findUnique({
    where: {
      postId,
      categoryId,
    },
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
      _count: {
        select: {
          eventLikes: true,
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  return {
    postId: event.postId,
    categoryId: event.categoryId,
    title: event.title,
    content: event.content,
    views: event.views,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    isClosed: event.isClosed,
    users: {
      id: event?.users.id,
      uuid: (event?.users.uuid as Buffer).toString("hex"),
      nickname: event?.users.nickname,
      profileImage: event?.users.profileImage,
    },
    tags: event?.eventTags.map((item: IEventTag) => item.tags),
    images: event?.eventImages.map((item: IEventImage) => item.images),
    likes: event._count.eventLikes,
  };
};

export const addEvent = async (
  tx: Prisma.TransactionClient,
  userId: Buffer,
  title: string,
  content: string,
  isClosed: boolean,
  date?: string
) => {
  const categoryId = CATEGORY.EVENTS;
  return await tx.events.create({
    data: {
      title,
      content,
      isClosed,
      categoryId,
      uuid: userId,
    },
  });
};
export const updateEventById = async (
  tx: Prisma.TransactionClient,
  userId: Buffer,
  postId: number,
  title: string,
  content: string,
  isClosed: boolean,
) => {
  const categoryId = CATEGORY.EVENTS;
  return await tx.events.update({
    where: {
      postId,
      uuid: userId,
      categoryId,
    },
    data: {
      title,
      content,
      isClosed,
    },
  });
};

export const removeEventById = async (tx: Prisma.TransactionClient, postId: number, userId: Buffer) => {
  const categoryId = CATEGORY.EVENTS;
  return await tx.events.delete({
    where: {
      postId,
      uuid: userId,
      categoryId,
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

export const removeTagsByIds = async (tx: Prisma.TransactionClient, tagIds: number[]) => {
  return await tx.eventTags.deleteMany({
    where: {
      tagId: {
        in: tagIds,
      },
    },
  });
};

export const removeImagesByIds = async (tx: Prisma.TransactionClient, imageIds: number[]) => {
  return await tx.eventImages.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
};

export const getLikeIds = async (postId: number) => {
  return await prisma.eventLikes.findMany({
    where: {
      postId,
    },
    select: {
      likeId: true,
    },
  });
};

export const removeLikesById = async (tx: Prisma.TransactionClient, postId: number) => {
  return await tx.eventLikes.deleteMany({
    where: {
      postId,
    },
  });
};
