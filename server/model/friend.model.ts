import { Prisma } from "@prisma/client";
import prisma from "../client";

export const getFriendCounts = async (userId: Buffer) => {
  return await prisma.friends.count({
    where: {
      uuid: userId,
    },
  });
};

export const getFriends = async (userId: Buffer, limit: number, cursor: number | undefined) => {
  const friends = await prisma.friends.findMany({
    where: {
      uuid: userId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { friendId: cursor } : undefined,
    select: {
      friendId: true,
      followingId: true,
      usersFriendsFollowingIdTousers: {
        select: {
          id: true,
          uuid: true,
          email: true,
          nickname: true,
          profileImage: true,
        },
      },
    },
  });

  return friends.map((friend) => {
    return {
      id: friend.friendId,
      userId: friend.followingId.toString("hex"),
      email: friend.usersFriendsFollowingIdTousers.email,
      nickname: friend.usersFriendsFollowingIdTousers.nickname,
      profileImage: friend.usersFriendsFollowingIdTousers.profileImage,
    };
  });
};

export const getFriendById = async (userId: Buffer, followingId: Buffer, tx?: Prisma.TransactionClient) => {
  const client = tx ?? prisma;

  return await client.friends.findFirst({
    where: {
      uuid: userId,
      followingId: followingId,
    },
  });
};

export const getFriendList = async (userId: Buffer) => {
  return await prisma.friends.findMany({
    where: {
      uuid: userId,
    },
  });
};

export const addFriend = async (tx: Prisma.TransactionClient, userId: Buffer, followingId: Buffer) => {
  return await tx.friends.create({
    data: {
      followingId: followingId,
      uuid: userId,
    },
  });
};

export const removeFriend = async (tx: Prisma.TransactionClient, friendId: number) => {
  return await tx.friends.delete({
    where: {
      friendId,
    },
  });
};
