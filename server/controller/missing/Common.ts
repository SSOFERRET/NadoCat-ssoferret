import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPostList, getPostsCount } from "../../model/missing.model";
import { IListData } from "../../types/post";
import { getImageById } from "../../model/image.model";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { getLocationById } from "../../model/location.model";

export const getPosts = async (req: Request, res: Response, postData: IListData) => {
  try {
    const { limit, cursor, orderBy, categoryId } = postData;
    const listData = { limit, cursor, orderBy, categoryId };

    const count = await getPostsCount(categoryId);

    let posts = await getPostList(listData);

    const nextCursor = posts.length === limit ? posts[posts.length - 1].postId : null;

    const result = {
      posts,
      pagination: {
        nextCursor,
        totalCount: count
      }
    };

    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
}