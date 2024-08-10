import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../client";
import {
  addComment,
  deleteCommentById,
  getCommunityComments,
  updateCommentById,
} from "../../model/communityComment.model";
import { Prisma } from "@prisma/client";
import { getUserId } from "./Communities";

//  CHECKLIST
// [x] model 코드 분리
// [] 에러처리 자세하게 구현하기
// [] 사용자 정보 받아오는 부분 구현 필요
export const getComments = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.communityId);
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const count = await prisma.communityComments.count({
      where: {
        communityId: id,
      },
    });
    const comments = await getCommunityComments(id, limit, cursor);

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
    const id = Number(req.params.communityId);
    const comment = req.body.comment;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await addComment(id, userId, comment);

    res.status(StatusCodes.CREATED).json({ message: "댓글이 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.communityId);
    const commentId = Number(req.params.commentId);
    const comment = req.body.comment;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await updateCommentById(id, userId, commentId, comment);

    res.status(StatusCodes.OK).json({ message: "댓글이 수정되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 댓글입니다." });
      }
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.communityId);
    const commentId = Number(req.params.commentId);
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    await deleteCommentById(id, userId, commentId);

    res.status(StatusCodes.OK).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 댓글입니다." });
      }
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
