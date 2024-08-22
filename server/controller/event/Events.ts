import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { addTag, deleteTags } from "../../model/tag.model";
import { addImage, deleteImages } from "../../model/image.model";
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
import { removeLikesByIds } from "../../model/like.model";
import { notifyNewPostToFriends } from "../notification/Notifications";
import { deleteOpensearchDocument, indexOpensearchDocument, updateOpensearchDocument } from "../search/Searches";
import { incrementViewCountAsAllowed } from "../common/Views";
import { uploadImageToS3 } from "../../util/images/s3ImageHandler";
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
// [ ] 좋아요 관련 부분 코드 분리
// [ ] 에러처리
export const getEvent = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.event_id);
    const categoryId = CATEGORY.EVENTS;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요
    const post = await getEventById(postId);

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 좋아요 여부
    const liked = await prisma.likes.findFirst({
      where: {
        postId,
        categoryId,
        uuid: userId,
      },
    });

    const result = {
      ...post,
      liked: !!liked,
    };

    // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.MISSINGS, postId);
    //   post.views += viewIncrementResult || 0;

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
  try {
    const { title, content, isClosed, date, tags } = req.body;
    const tagList = JSON.parse(tags);
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const newPost = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await addEvent(tx, userId, title, content, !!isClosed, date);
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
        const imageUrls = (await uploadImageToS3(req, CATEGORY.COMMUNITIES, postId)) as any;
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

      await indexOpensearchDocument(CATEGORY.EVENTS, title, content, post.postId);

      return post;
    });

    res.status(StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다.", postId: newPost.postId });
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
// [ ] 에러처리
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요
    const id = Number(req.params.community_id);
    const postId = Number(req.params.event_id);

    const { title, content, isClosed, date, images, tags, newTags, deleteTagIds, newImages, deleteImageIds } = req.body;

    if (!title || !content || !isClosed || !date || !newTags || !deleteTagIds || !deleteImageIds) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateEventById(tx, userId, postId, title, content, isClosed, date);

      await removeTagsByIds(tx, deleteTagIds);

      await deleteTags(tx, deleteTagIds);

      const tags = await Promise.all(newTags.map((tag: string) => addTag(tx, tag)));

      const formatedTags = tags.map((tag: ITag) => ({
        tagId: tag.tagId,
        postId: id,
      }));

      await addEventTags(tx, formatedTags);

      await removeImagesByIds(tx, deleteImageIds);

      await deleteImages(tx, deleteImageIds);

      const images = await Promise.all(newImages.map((url: string) => addImage(tx, url)));

      const formatedImages = images.map((image: IImage) => ({
        imageId: image.imageId,
        postId: id,
      }));

      await addEventImages(tx, formatedImages);

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
  try {
    const postId = Number(req.params.event_id);
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const post = await getEventById(postId);

    const likeIds = await getLikeIds(postId);

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (post.tags?.length) {
        const tagIds = post.tags.map((item: ITag) => item.tagId);
        await removeTagsByIds(tx, tagIds);
        await deleteTags(tx, tagIds);
      }

      if (post.images?.length) {
        const imageIds = post.images.map((item: IImage) => item.imageId);
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