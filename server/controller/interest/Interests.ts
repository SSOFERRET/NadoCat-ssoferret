import { Request, Response, NextFunction } from "express";
import prisma from "../../client";
import { interest } from "../../model/interest.model";
import { StatusCodes } from "http-status-codes";

export const getInterests = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    console.log("userid test:" +userId);
    if (!userId) {
      return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."});
    }

    const interestPosts = await interest(userId);

    if (!interestPosts.length) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "좋아요한 게시글이 없습니다." });
    }
    
    res.status(StatusCodes.OK).json(interestPosts);

  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버에 에러가 발생했습니다."});
  }
};

