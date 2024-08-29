import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getImageFormatsByPostId, getPostList, getPostsCount } from "../../model/missing.model";
import { IListData } from "../../types/post";
import { getImageById } from "../../model/image.model";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { getLocationById } from "../../model/location.model";
import { CATEGORY } from "../../constants/category";

export const getPosts = async (req: Request, res: Response, postData: IListData, missingId?: number) => {
  try {
    const { limit, cursor, orderBy, categoryId } = postData;
    const listData = { limit, cursor, orderBy, categoryId };

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const count = await getPostsCount(categoryId);

      let posts: any[] = [];
      let userIds: string[] = [];
      if (categoryId === CATEGORY.MISSINGS)
        [posts, userIds] = await getPostList(listData);
      else if (categoryId === CATEGORY.MISSING_REPORTS)
        [posts, userIds] = await getPostList(listData, missingId);

      userIds.forEach((userId: string, idx: number) => {
        posts[idx].users = { ...posts[idx].users, userId };
      })

      const postIds = posts.map((post: any) => post.postId);
      const imageIds = await Promise.all(postIds.map(async (postId: number) => {
        const eachImageFormats = await getImageFormatsByPostId(tx, { categoryId, postId });
        return eachImageFormats?.sort((a, b) => a.imageId - b.imageId)[0].imageId;
      }));

      const thumbnails = await Promise.all(imageIds.map(async (imageId) => await getImageById(tx, imageId as number)))
      posts = posts.map((post: any, idx: number) => {
        return {
          ...post,
          images: [thumbnails[idx]],
        }
      })

      const nextCursor = posts.length === limit ? posts[posts.length - 1].postId : null;

      const result = {
        posts,
        pagination: {
          nextCursor,
          totalCount: count
        }
      };
      return result
    })


    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
}