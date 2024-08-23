import { Prisma } from "@prisma/client";

export const getLiked = async (tx: Prisma.TransactionClient, postId: number, categoryId: number, userId: Buffer) => {
  return await tx.likes.findFirst({
    where: {
      postId,
      categoryId,
      uuid: userId,
    },
  });
};

export const removeLikesByIds = async (tx: Prisma.TransactionClient, likeIds: { likeId: number }[]) => {
  await tx.likes.deleteMany({
    where: {
      likeId: {
        in: likeIds.map((like) => like.likeId),
      },
    },
  });
};

export const saveLike = async (tx: Prisma.TransactionClient, postId: number, categoryId: number, userId: Buffer) => {
  return await tx.likes.create({
    data: {
      postId,
      categoryId,
      uuid: userId,
    },
  });
};

export const removeLike = async (tx: Prisma.TransactionClient, likeId: number) => {
  return await tx.likes.delete({
    where: {
      likeId,
    },
  });
};

export const findLike = async (tx: Prisma.TransactionClient, postId: number, categoryId: number, userId: Buffer) => {
  return await tx.likes.findFirst({
    where: {
      postId,
      categoryId,
      uuid: userId,
    },
  });
};

export const addCommunityLike = async (tx: Prisma.TransactionClient, postId: number, likeId: number) => {
  return await tx.communityLikes.create({
    data: {
      likeId,
      postId,
    },
  });
};

export const addEventLike = async (tx: Prisma.TransactionClient, postId: number, likeId: number) => {
  return await tx.eventLikes.create({
    data: {
      likeId,
      postId,
    },
  });
};

export const deleteCommunityLike = async (tx: Prisma.TransactionClient, postId: number, likeId: number) => {
  return await tx.communityLikes.delete({
    where: {
      likeId,
      postId,
    },
  });
};

export const deleteEventLike = async (tx: Prisma.TransactionClient, postId: number, likeId: number) => {
  return await tx.eventLikes.delete({
    where: {
      likeId,
      postId,
    },
  });
};
