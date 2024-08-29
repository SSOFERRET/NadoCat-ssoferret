import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleControllerError } from "../../util/errors/errors";
import { CATEGORY } from "../../constants/category";
import prisma from "../../client";
import {
  addCommunityLike,
  addEventLike,
  deleteCommunityLike,
  deleteEventLike,
  findLike,
  removeLike,
  saveLike,
} from "../../model/like.model";
import { Prisma } from "@prisma/client";

export const addLike = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }

    const categoryId = Number(req.params.category_id);
    const postId = Number(req.params.post_id);
    const userId = Buffer.from(uuid, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const like = await saveLike(tx, postId, categoryId, userId);

      if (categoryId === CATEGORY.COMMUNITIES) {
        await addCommunityLike(tx, postId, like.likeId);
      } else if (categoryId === CATEGORY.EVENTS) {
        await addEventLike(tx, postId, like.likeId);
      }
    });

    res.status(StatusCodes.CREATED).json({ message: "좋아요가 등록 되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }

    const categoryId = Number(req.params.category_id);
    const postId = Number(req.params.post_id);
    const userId = Buffer.from(uuid, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const like = await findLike(tx, postId, categoryId, userId);

      if (!like) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (categoryId === CATEGORY.COMMUNITIES) {
        await deleteCommunityLike(tx, postId, like.likeId);
      } else if (categoryId === CATEGORY.EVENTS) {
        await deleteEventLike(tx, postId, like.likeId);
      }

      await removeLike(tx, like.likeId);
    });

    res.status(StatusCodes.OK).json({ message: "좋아요가 삭제 되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  } finally {
    await prisma.$disconnect();
  }
};
