import { Prisma } from "@prisma/client";
import prisma from "../client";

export const getCommunityComments = async (
  postId: number,
  limit: number,
  cursor: number | undefined
) => {
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
      updatedAt:true,
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
  return await prisma.communityComments.create({
    data: {
      uuid: Buffer.from(userId, "hex"),
      communityId: postId,
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
  return await prisma.communityComments.update({
    where: {
      communityId: postId,
      communityCommentId: commentId,
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
  return await prisma.communityComments.delete({
    where: {
      communityId: postId,
      communityCommentId: commentId,
      uuid: Buffer.from(userId, "hex"),
    },
  });
};

export const deleteCommentsById = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.communityComments.deleteMany({
    where: {
      communityId: postId,
    },
  });
};
