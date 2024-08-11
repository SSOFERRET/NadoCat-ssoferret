import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import {
  addFriend,
  getFriendById,
  getFriendCounts,
  getFriends,
  removeFriend,
} from "../../model/friend.model";

export const followings = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const count = await getFriendCounts(userId);

    const friends = await getFriends(userId, limit, cursor);

    const nextCursor =
      friends.length === limit ? friends[friends.length - 1].id : null;

    res.status(StatusCodes.OK).json({
      follows: friends,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    });
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

    await addFriend(userId, followingId);

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

    const friend = await getFriendById(userId, followingId);

    if (!friend) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ meesage: "요청한 친구 정보를 찾을 수 없습니다." });
    }

    await removeFriend(friend.friendId);

    res.status(StatusCodes.OK).json({ message: "친구 삭제가 완료되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
