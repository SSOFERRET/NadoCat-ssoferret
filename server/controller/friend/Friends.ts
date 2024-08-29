import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { addFriend, getFriendById, getFriendCounts, getFriends, removeFriend } from "../../model/friend.model";
import { handleControllerError } from "../../util/errors/errors";
import { notify } from "../notification/Notifications";
import { Prisma } from "@prisma/client";

export const followings = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }

    const userId = Buffer.from(uuid, "hex");
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

export const getFollowing = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;

  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }

    const userId = Buffer.from(uuid, "hex");
    const followingId = Buffer.from(req.params.following_id, "hex");

    const friend = await getFriendById(userId, followingId);

    res.status(StatusCodes.CREATED).json(friend);
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const follow = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;

  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }

    const userId = Buffer.from(uuid, "hex");
    const followingId = Buffer.from(req.params.following_id, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await addFriend(tx, userId, followingId);

      notify({
        type: "follow",
        receiver: req.params.following_id,
        sender: uuid,
        url: `/users/user/${req.params.following_id}`,
      });
    });

    res.status(StatusCodes.CREATED).json({ message: "친구 추가가 완료되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;

  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }

    const userId = Buffer.from(uuid, "hex");
    const followingId = Buffer.from(req.params.following_id, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const friend = await getFriendById(userId, followingId, tx);

      if (!friend) {
        throw new Error("요청한 친구 정보를 찾을 수 없습니다.");
      }

      await removeFriend(tx, friend.friendId);
    });

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    handleControllerError(error, res);
  }
};
