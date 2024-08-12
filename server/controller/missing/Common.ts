import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPostList, getPostsCount } from "../../model/missing.model";
import { IListData } from "../../types/post";
import { getImageById } from "../../model/image.model";
import prisma from "../../client";
import { Prisma } from "@prisma/client";

export const getPosts = async (req: Request, res: Response, postData: IListData) => {
  try {
    const { limit, cursor, orderBy, categoryId } = postData;
    const listData = { limit, cursor, orderBy, categoryId };

    const count = await getPostsCount(categoryId);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let postList = await getPostList(listData);
      if (postList.thumbnail) {
        const image = await getImageById(tx, postList.thumbnail);
        postList = { ...postList, image };
      }

      const nextCursor = postList.length === limit ? postList[postList.length - 1].postId : null;

      const result = {
        posts: postList,
        pagination: {
          nextCursor,
          totalCount: count
        }
      };

      res.status(StatusCodes.OK).json(result);
    })
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
}