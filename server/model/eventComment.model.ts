import { Prisma } from "@prisma/client";
import prisma from "../client";

export const getCommentCount = async (postId: number) => {
  return prisma.eventComments.count({
    where: {
      eventId: postId,
    },
  });
};

export const getEventComments = async (postId: number, limit: number, cursor: number | undefined) => {
  const result = await prisma.eventComments.findMany({
    where: {
      eventId: postId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { eventCommentId: cursor } : undefined,
    orderBy: [
      {
        eventCommentId: "asc",
      },
    ],
    select: {
      eventCommentId: true,
      comment: true,
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
    },
  });

  return result.map((item) => {
    return {
      commentId: item.eventCommentId,
      comment: item.comment,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      users: {
        id: item.users.id,
        uuid: item.users.uuid.toString("hex"),
        nickname: item.users.nickname,
        profileImage: item.users.nickname,
      },
    };
  });
};

export const addComment = async (postId: number, userId: Buffer, comment: string) => {
  return await prisma.eventComments.create({
    data: {
      uuid: userId,
      eventId: postId,
      comment,
    },
  });
};

export const updateCommentById = async (postId: number, userId: Buffer, commentId: number, comment: string) => {
  return await prisma.eventComments.update({
    where: {
      eventId: postId,
      eventCommentId: commentId,
      uuid: userId,
    },
    data: {
      comment,
    },
  });
};

export const deleteCommentById = async (postId: number, userId: Buffer, commentId: number) => {
  return await prisma.eventComments.delete({
    where: {
      eventId: postId,
      eventCommentId: commentId,
      uuid: userId,
    },
  });
};

export const deleteCommentsById = async (tx: Prisma.TransactionClient, postId: number) => {
  return await tx.eventComments.deleteMany({
    where: {
      eventId: postId,
    },
  });
};
