import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import prisma from "../../client";

export const followings = async (_req: Request, res: Response) => {
  try {
    const userId = await getUserId();

    const friends = await prisma.friends.findMany({
      where: {
        uuid: Buffer.from(userId, "hex"),
      },
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

    const result = friends.map((friend) => {
      return {
        id: friend.friendId,
        userId: friend.followingId.toString("hex"),
        email: friend.usersFriendsFollowingIdTousers.email,
        nickname: friend.usersFriendsFollowingIdTousers.nickname,
        profileImage: friend.usersFriendsFollowingIdTousers.profileImage,
      };
    });

    res.status(StatusCodes.OK).json({ follows: result });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const follow = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const followingId = req.params.following_id;

    await prisma.friends.create({
      data: {
        followingId: Buffer.from(followingId, "hex"),
        uuid: Buffer.from(userId, "hex"),
      },
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "친구 추가가 완료되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const followingId = req.params.following_id;

    const friend = await prisma.friends.findFirst({
      where: {
        uuid: Buffer.from(userId, "hex"),
        followingId: Buffer.from(followingId, "hex"),
      },
    });

    if (!friend) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ meesage: "요청한 친구 정보를 찾을 수 없습니다." });
    }

    await prisma.friends.delete({
      where: {
        friendId: friend.friendId,
      },
    });

    res.status(StatusCodes.OK).json({ message: "친구 삭제가 완료되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
