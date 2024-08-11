import { Request, Response } from "express";
import prisma from "../../client";
import {
  addComment,
  deleteCommentById,
  getEventComments,
  updateCommentById,
} from "../../model/eventComment.model";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import { Prisma } from "@prisma/client";
export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const count = await prisma.communityComments.count({
      where: {
        communityId: postId,
      },
    });

    const comments = await getEventComments(postId, limit, cursor);

    const nextCursor =
      comments.length === limit ? comments[comments.length - 1].comment : null;

    const result = {
      comments,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const comment = req.body.comment;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await addComment(postId, userId, comment);

    res.status(StatusCodes.CREATED).json({ message: "댓글이 등록되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 게시글입니다." });
      }
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const commentId = Number(req.params.comment_id);
    const comment = req.body.comment;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await updateCommentById(postId, userId, commentId, comment);

    res.status(StatusCodes.OK).json({ message: "댓글이 수정되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 댓글입니다." });
      }

      if (error.code === "P2003") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 게시글입니다." });
      }
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const commentId = Number(req.params.comment_id);
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    await deleteCommentById(postId, userId, commentId);

    res.status(StatusCodes.OK).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 댓글입니다." });
      }

      if (error.code === "P2003") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 게시글입니다." });
      }
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
