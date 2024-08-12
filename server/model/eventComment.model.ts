import { Prisma } from "@prisma/client";
import prisma from "../client";

export const getEventComments = async (
  postId: number,
  limit: number,
  cursor: number | undefined
) => {
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
      users: {
        id: item.users.id,
        uuid: item.users.uuid.toString("hex"),
        nickname: item.users.nickname,
        profileImage: item.users.nickname,
      },
    };
  });
};

export const addComment = async (
  postId: number,
  userId: string,
  comment: string
) => {
  return await prisma.eventComments.create({
    data: {
      uuid: Buffer.from(userId, "hex"),
      eventId: postId,
      comment,
    },
  });
};

export const updateCommentById = async (
  postId: number,
  userId: string,
  commentId: number,
  comment: string
) => {
  return await prisma.eventComments.update({
    where: {
      eventId: postId,
      eventCommentId: commentId,
      uuid: Buffer.from(userId, "hex"),
    },
    data: {
      comment,
    },
  });
};

export const deleteCommentById = async (
  postId: number,
  userId: string,
  commentId: number
) => {
  return await prisma.eventComments.delete({
    where: {
      eventId: postId,
      eventCommentId: commentId,
      uuid: Buffer.from(userId, "hex"),
    },
  });
};

export const deleteCommentsById = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.eventComments.deleteMany({
    where: {
      eventId: postId,
    },
  });
};
