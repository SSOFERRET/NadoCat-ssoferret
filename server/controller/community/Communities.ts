import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import prisma from "../../client";
import {
  addCommunity,
  addCommunityTags,
  addCommunityImages,
  getCommunitiesCount,
  getCommunityById,
  getCommunityList,
  removeCommunityById,
  updateCommunityById,
  removeImagesByIds,
  removeTagsByIds,
  removeLikesById,
  getLikeIds,
} from "../../model/community.model";
import { deleteImages } from "../../model/image.model";
import { addTag, deleteTags } from "../../model/tag.model";
import { deleteCommentsById } from "../../model/communityComment.model";
import { handleControllerError } from "../../util/errors/errors";
import { CATEGORY } from "../../constants/category";
import { IImage } from "../../types/image";
import { ITag } from "../../types/tag";
import { getLiked, removeLikesByIds } from "../../model/like.model";
import { notifyNewPostToFriends } from "../notification/Notifications";
import { incrementViewCountAsAllowed } from "../common/Views";
import { deleteImageFromS3ByImageId, uploadImagesToS3 } from "../../util/images/s3ImageHandler";
import { addNewImages } from "../../util/images/addNewImages";
import { deleteOpensearchDocument, indexOpensearchDocument, updateOpensearchDocument } from "../search/Searches";

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const sort = req.query.sort?.toString() ?? "latest";
    const count = await getCommunitiesCount();

    const communities = await getCommunityList(limit, sort, cursor);

    const nextCursor = communities.length === limit ? communities[communities.length - 1].postId : null;

    const result = {
      posts: communities,
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

export const getCommunity = async (req: Request, res: Response) => {
  const uuid = req.headers["x-uuid"] as string;

  try {
    const postId = Number(req.params.community_id);
    const categoryId = CATEGORY.COMMUNITIES;
    const userId = uuid && Buffer.from(uuid, "hex");

    let result;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const community = await getCommunityById(tx, postId);

      if (!community) throw new Error("No Post"); //타입가드

      const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.COMMUNITIES, postId);
      community.views += viewIncrementResult || 0;

      let liked;

      if (userId) {
        liked = await getLiked(tx, postId, categoryId, userId);
      }

      result = {
        ...community,
        liked: !!liked,
      };
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const createCommunity = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const userId = Buffer.from(uuid, "hex");
    const { title, content, tags } = req.body;

    const tagList = JSON.parse(tags);

    const newPost = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await addCommunity(tx, userId, title, content);
      const postId = post.postId;

      if (tagList.length > 0) {
        const newTags = await Promise.all(tagList.map((tag: string) => addTag(tx, tag)));
        const formatedTags = newTags.map((tag: ITag) => ({
          tagId: tag.tagId,
          postId,
        }));
        await addCommunityTags(tx, formatedTags);
      }

      if (req.files) {
        const imageUrls = (await uploadImagesToS3(req)) as any;
        const newImages = await addNewImages(
          tx,
          {
            userId,
            postId,
            categoryId: CATEGORY.COMMUNITIES,
          },
          imageUrls
        );
        const formatedImages = newImages.map((imageId: number) => ({
          imageId,
          postId,
        }));
        await addCommunityImages(tx, formatedImages);
      }

      await notifyNewPostToFriends(userId, CATEGORY.COMMUNITIES, post.postId);

      return post;
    });

    await indexOpensearchDocument(CATEGORY.COMMUNITIES, newPost.postId, newPost);

    res.status(StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다.", postId: newPost.postId });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const updateCommunity = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const postId = Number(req.params.community_id);
    const userId = Buffer.from(uuid, "hex");

    const { title, content, tags, deleteTagIds, deleteImageIds } = req.body;

    if (!title || !content || !tags || !deleteTagIds || !deleteImageIds) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }

    const tagList = JSON.parse(tags);
    const tagIds = JSON.parse(deleteTagIds);
    const imageIds = JSON.parse(deleteImageIds);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateCommunityById(tx, postId, userId, title, content);

      await removeTagsByIds(tx, tagIds);

      await deleteTags(tx, tagIds);

      const newTags = await Promise.all(tagList.map((tag: string) => addTag(tx, tag)));

      const formatedTags = newTags.map((tag: ITag) => ({
        tagId: tag.tagId,
        postId,
      }));

      await addCommunityTags(tx, formatedTags);

      if (req.files) {
        const imageUrls = (await uploadImagesToS3(req)) as any;
        const newImages = await addNewImages(
          tx,
          {
            userId,
            postId,
            categoryId: CATEGORY.COMMUNITIES,
          },
          imageUrls
        );

        const formatedImages = newImages.map((imageId: number) => ({
          imageId,
          postId,
        }));

        await addCommunityImages(tx, formatedImages);
      }

      await deleteImageFromS3ByImageId(tx, imageIds);

      await removeImagesByIds(tx, imageIds);

      await deleteImages(tx, imageIds);

      // await updateOpensearchDocument(CATEGORY.COMMUNITIES, postId, {
      //   content: 

      // })
    });

    res.status(StatusCodes.CREATED).json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const deleteCommunity = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const postId = Number(req.params.community_id);
    const userId = Buffer.from(uuid, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await getCommunityById(tx, postId);

      const likeIds = await getLikeIds(tx, postId);

      if (!post) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
      }

      if (post.tags?.length) {
        const tagIds = post.tags.map((item: ITag) => item.tagId);
        await removeTagsByIds(tx, tagIds);
        await deleteTags(tx, tagIds);
      }

      if (post.images?.length) {
        const imageIds = post.images.map((item: IImage) => item.imageId);
        await deleteImageFromS3ByImageId(tx, imageIds);
        await removeImagesByIds(tx, imageIds);
        await deleteImages(tx, imageIds);
      }

      if (likeIds.length) {
        await removeLikesById(tx, postId);
        await removeLikesByIds(tx, likeIds);
      }

      await deleteCommentsById(tx, postId);

      await removeCommunityById(tx, postId, userId);

      await deleteOpensearchDocument(CATEGORY.COMMUNITIES, postId);
    });

    res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};
