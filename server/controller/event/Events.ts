import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { addTag, deleteTags } from "../../model/tag.model";
import { deleteImages } from "../../model/image.model";
import {
  addEvent,
  addEventImages,
  addEventTags,
  getEventById,
  getEventList,
  getEventsCount,
  getLikeIds,
  removeEventById,
  removeImagesByIds,
  removeLikesById,
  removeTagsByIds,
  updateEventById,
} from "../../model/event.model";
import { deleteCommentsById } from "../../model/eventComment.model";
import { handleControllerError } from "../../util/errors/errors";
import { CATEGORY } from "../../constants/category";
import { ITag } from "../../types/tag";
import { IImage } from "../../types/image";
import { getLiked, removeLikesByIds } from "../../model/like.model";
import { notifyNewPostToFriends } from "../notification/Notifications";
import { deleteOpensearchDocument, indexOpensearchDocument, indexResultToOpensearch, updateOpensearchDocument } from "../search/Searches";
import { incrementViewCountAsAllowed } from "../common/Views";
import { deleteImageFromS3ByImageId, uploadImagesToS3 } from "../../util/images/s3ImageHandler";
import { addNewImages } from "../../util/images/addNewImages";

// CHECKLIST
// [x] 이벤트 게시판 게시글 목록 가져오기
// [x] 페이지네이션 구현
// [x] 정렬 구현
// [ ] 좋아요 수와 좋아요 여부 구현 -> 정렬하려면 필요할지도..?
// [ ] 에러처리

export const getEvents = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const sort = req.query.sort?.toString() || "latest";
    const count = await getEventsCount();

    const posts = await getEventList(limit, sort, cursor);

    const nextCursor = posts.length === limit ? posts[posts.length - 1].postId : null;

    const result = {
      posts,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 가져오기
// [x] 좋아요 관련 부분 코드 분리
// [ ] 에러처리
export const getEvent = async (req: Request, res: Response) => {
  const uuid = req.headers["x-uuid"] as string;
  try {
    const postId = Number(req.params.event_id);
    const categoryId = CATEGORY.EVENTS;
    const userId = uuid && Buffer.from(uuid, "hex");

    let result;
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await getEventById(tx, postId);

      if (!post) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
      }

      let liked;

      if (userId) {
        liked = await getLiked(tx, postId, categoryId, userId);
      }

      result = {
        ...post,
        liked: !!liked,
      };

      // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.MISSINGS, postId);
      //   post.views += viewIncrementResult || 0;
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    handleControllerError(error, res);
  }
};

// CHECKLIST
// [x] 이미지 저장 구현
// [x] 이벤트 게시판 게시글 등록
// [ ] 예외 처리
// [ ] 에러처리
export const createEvent = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const { title, content, isClosed, tags } = req.body;
    const tagList = JSON.parse(tags);
    const userId = Buffer.from(uuid, "hex");

    const newPost = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await addEvent(tx, userId, title, content, !!isClosed);
      const postId = post.postId;

      if (tagList.length > 0) {
        const newTags = await Promise.all(tagList.map((tag: string) => addTag(tx, tag)));

        const formatedTags = newTags.map((tag: ITag) => ({
          tagId: tag.tagId,
          postId: post.postId,
        }));

        await addEventTags(tx, formatedTags);
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

        await addEventImages(tx, formatedImages);
      }

      await notifyNewPostToFriends(userId, CATEGORY.EVENTS, post.postId);

      return post;
    });

    res.status(StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다.", postId: newPost.postId });

    await indexResultToOpensearch(CATEGORY.EVENTS, newPost.postId);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 수정
// [x] 이미지 업로드 구현
// [ ] 에러처리
export const updateEvent = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const userId = Buffer.from(uuid, "hex");
    const postId = Number(req.params.event_id);

    const { title, content, tags, deleteTagIds, deleteImageIds, isClosed } = req.body;
    console.log(req.body)

    if (!title || !content || !tags || !deleteTagIds || !deleteImageIds ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }

    const tagList = JSON.parse(tags);
    const tagIds = JSON.parse(deleteTagIds);
    const imageIds = JSON.parse(deleteImageIds);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateEventById(tx, userId, postId, title, content, !!isClosed);

      await removeTagsByIds(tx, tagIds);

      await deleteTags(tx, tagIds);

      const newTags = await Promise.all(tagList.map((tag: string) => addTag(tx, tag)));

      const formatedTags = newTags.map((tag: ITag) => ({
        tagId: tag.tagId,
        postId,
      }));

      await addEventTags(tx, formatedTags);

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

        await addEventImages(tx, formatedImages);
      }

      await deleteImageFromS3ByImageId(tx, imageIds);

      await removeImagesByIds(tx, imageIds);

      await deleteImages(tx, imageIds);

      await updateOpensearchDocument(CATEGORY.EVENTS, postId, { content });
    });

    res.status(StatusCodes.CREATED).json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 삭제
// [x] 관련 댓글 삭제
// [ ] 에러처리
export const deleteEvent = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const postId = Number(req.params.event_id);
    const userId = Buffer.from(uuid, "hex");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await getEventById(tx, postId);

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

      await removeEventById(tx, postId, userId);

      await deleteOpensearchDocument(CATEGORY.EVENTS, postId);
    });

    res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};
