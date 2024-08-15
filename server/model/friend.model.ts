import { Prisma } from "@prisma/client";
import prisma from "../client";
import { getUserId } from "../controller/community/Communities";

export const getFriendCounts = async (userId: string) => {
  return await prisma.friends.count({
    where: {
      uuid: Buffer.from(userId, "hex"),
    },
  });
};

export const getFriends = async (
  userId: string,
  limit: number,
  cursor: number | undefined
) => {
  const friends = await prisma.friends.findMany({
    where: {
      uuid: Buffer.from(userId, "hex"),
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

export const getFriendById = async (userId: string, followingId: string) => {
  return await prisma.friends.findFirst({
    where: {
      uuid: Buffer.from(userId, "hex"),
      followingId: Buffer.from(followingId, "hex"),
    },
  });
};

export const getFriendList = async (
  userId: Buffer
) => {
  return await prisma.friends.findMany({
    where: {
      uuid: userId
    }
  })
};

export const addFriend = async (userId: string, followingId: string) => {
  return await prisma.friends.create({
    data: {
      followingId: Buffer.from(followingId, "hex"),
      uuid: Buffer.from(userId, "hex"),
    },
  });
};

export const removeFriend = async (friendId: number) => {
  return await prisma.friends.delete({
    where: {
      friendId,
    },
  });
};
