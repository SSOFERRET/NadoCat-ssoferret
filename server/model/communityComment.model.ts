import { Prisma } from "@prisma/client";
import prisma from "../client";

export const getCommentCount = async (postId: number) => {
  return prisma.communityComments.count({
    where: {
      communityId: postId,
    },
  });
};

export const getCommunityComments = async (postId: number, limit: number, cursor: number | undefined) => {
  const result = await prisma.communityComments.findMany({
    where: {
      communityId: postId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { communityCommentId: cursor } : undefined,
    orderBy: [
      {
        communityCommentId: "asc",
      },
    ],
    select: {
      communityCommentId: true,
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
      commentId: item.communityCommentId,
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
  return await prisma.communityComments.create({
    data: {
      uuid: userId,
      communityId: postId,
      comment,
    },
  });
};

export const updateCommentById = async (postId: number, userId: Buffer, commentId: number, comment: string) => {
  return await prisma.communityComments.update({
    where: {
      communityId: postId,
      communityCommentId: commentId,
      uuid: userId,
    },
    data: {
      comment,
    },
  });
};

export const deleteCommentById = async (postId: number, userId: Buffer, commentId: number) => {
  return await prisma.communityComments.delete({
    where: {
      communityId: postId,
      communityCommentId: commentId,
      uuid: userId,
    },
  });
};

export const deleteCommentsById = async (tx: Prisma.TransactionClient, postId: number) => {
  return await tx.communityComments.deleteMany({
    where: {
      communityId: postId,
    },
  });
};
