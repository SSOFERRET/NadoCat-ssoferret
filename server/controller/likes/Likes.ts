import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import { handleControllerError } from "../../util/errors/errors";
import { CATEGORY } from "../../constants/category";
import prisma from "../../client";

export const addLike = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.category_id);
    const postId = Number(req.params.post_id);
    const userId = await getUserId();

    const like = await prisma.likes.create({
      data: {
        postId,
        categoryId,
        uuid: userId,
      },
    });

    if (categoryId === CATEGORY.COMMUNITIES) {
      await prisma.communityLikes.create({
        data: {
          likeId: like.likeId,
          postId,
        },
      });
    } else if (categoryId === CATEGORY.EVENTS) {
      await prisma.eventLikes.create({
        data: {
          likeId: like.likeId,
          postId,
        },
      });
    }

    res.status(StatusCodes.CREATED).json({ message: "좋아요가 등록 되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.category_id);
    const postId = Number(req.params.post_id);
    const userId = await getUserId();

    const like = await prisma.likes.findFirst({
      where: {
        postId,
        categoryId,
        uuid: userId,
      },
    });

    if (!like) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    if (categoryId === CATEGORY.COMMUNITIES) {
      await prisma.communityLikes.delete({
        where: {
          likeId: like.likeId,
          postId,
        },
      });
    } else if (categoryId === CATEGORY.EVENTS) {
      await prisma.eventLikes.delete({
        where: {
          likeId: like.likeId,
          postId,
        },
      });
    }

    await prisma.likes.delete({
      where: {
        likeId: like.likeId,
      },
    });

    res.status(StatusCodes.OK).json({ message: "좋아요가 삭제 되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};
