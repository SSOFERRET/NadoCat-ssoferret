import { Request, Response } from "express";
import prisma from "../../client";
import {
  addComment,
  deleteCommentById,
  getCommentCount,
  getEventComments,
  updateCommentById,
} from "../../model/eventComment.model";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import { handleControllerError } from "../../util/errors/errors";
import { notifyNewComment } from "../notification/Notifications";
import { CATEGORY } from "../../constants/category";

export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const count = await getCommentCount(postId);

    const comments = await getEventComments(postId, limit, cursor);

    const nextCursor = comments.length === limit ? comments[comments.length - 1].commentId : null;

    const result = {
      comments,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = Buffer.from(req.user.uuid, "hex");
    // const userId = req.user.uuid;
    const postId = Number(req.params.community_id);
    const comment = req.body.comment;
    // const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    if (!comment) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }

    const newComment = await addComment(postId, userId, comment);

    if (newComment.eventCommentId)
      await notifyNewComment(Buffer.from(userId), CATEGORY.EVENTS, postId, newComment.eventCommentId);

    res.status(StatusCodes.CREATED).json({ message: "댓글이 등록되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const commentId = Number(req.params.comment_id);
    const comment = req.body.comment;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    if (!comment) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }

    await updateCommentById(postId, userId, commentId, comment);

    res.status(StatusCodes.OK).json({ message: "댓글이 수정되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
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
    handleControllerError(error, res);
  }
};