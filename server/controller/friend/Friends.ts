import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import { addFriend, getFriendById, getFriendCounts, getFriends, removeFriend } from "../../model/friend.model";
import { handleControllerError } from "../../util/errors/errors";
import { notify } from "../notification/Notifications";
import prisma from "../../client";
import { Prisma } from "@prisma/client";

export const followings = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const count = await getFriendCounts(userId);

    const friends = await getFriends(userId, limit, cursor);

    const nextCursor = friends.length === limit ? friends[friends.length - 1].id : null;

    res.status(StatusCodes.OK).json({
      follows: friends,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const follow = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const followingId = Buffer.from(req.params.following_idm, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await addFriend(tx, userId, followingId);

      notify({
        type: "follow",
        receiver: followingId,
        sender: userId,
        url: `/users/${followingId}/profile`,
      });
    });

    res.status(StatusCodes.CREATED).json({ message: "친구 추가가 완료되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const unfollow = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const followingId = Buffer.from(req.params.following_idm, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const friend = await getFriendById(tx, userId, followingId);

      if (!friend) {
        return res.status(StatusCodes.NOT_FOUND).json({ meesage: "요청한 친구 정보를 찾을 수 없습니다." });
      }

      await removeFriend(tx, friend.friendId);
    });

    res.status(StatusCodes.OK).json({ message: "친구 삭제가 완료되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};
