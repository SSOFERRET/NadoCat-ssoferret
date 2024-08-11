import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { addTag, deleteTags } from "../../model/tag.model";
import { IImage, ITag } from "../../types/community";
import { addImage, deleteImages } from "../../model/image.model";
import {
  addEvent,
  addEventImages,
  addEventTags,
  deleteEventImagesByImageIds,
  deleteEventTagByTagIds,
  getEventById,
  getEventList,
  removeEventById,
  updateEventById,
} from "../../model/event.model";
import { deleteCommentsById } from "../../model/eventComment.model";

// CHECKLIST
// [x] 이벤트 게시판 게시글 목록 가져오기
// [x] 페이지네이션 구현
// [x] 정렬 구현
// [ ] 좋아요 수와 좋아요 여부 구현 -> 정렬하려면 필요할지도..?
// [ ] 에러처리

const getOrderBy = (sort: string) => {
  switch (sort) {
    case "latest":
      return { sortBy: "createdAt", sortOrder: "asc" };
    case "views":
      return { sortBy: "views", sortOrder: "desc" };
    case "likes":
      return { sortBy: "likes", sortOrder: "desc" }; // 테이블 수정 필요
    default:
      throw new Error("일치하는 정렬 기준이 없습니다.");
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const sort = req.query.sort?.toString() ?? "latest";
    const orderBy = getOrderBy(sort);
    const categoryId = Number(req.query.category_id) || 2;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const count = await prisma.events.count();

    const posts = await getEventList(categoryId, limit, orderBy, cursor);

    const nextCursor =
      posts.length === limit ? posts[posts.length - 1].postId : null;

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
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 가져오기
// [ ] 좋아요, 좋아요 여부 처리 수정
// [ ] 에러처리
export const getEvent = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.evnet_id);
    const categoryId = Number(req.query.category_id) || 2;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요
    const post = await getEventById(postId, categoryId);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "게시글을 찾을 수 없습니다." });
    }

    //TODO 좋아요 수, 좋아요 여부 수정 필요
    // 좋아요 수
    const likes = await prisma.likes.count({
      where: {
        postId,
        categoryId,
      },
    });

    // 좋아요 여부
    const liked = await prisma.likes.findFirst({
      where: {
        postId,
        categoryId,
        uuid: Buffer.from(userId, "hex"), // NOTE 타입 변환
      },
    });

    const result = {
      ...post,
      likes,
      liked: !!liked,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 등록
// [ ] 예외 처리
// [ ] 에러처리
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, content, isClosed, date, tags, images } = req.body;
    const categoryId = Number(req.query.category_id) || 2;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await addEvent(
        tx,
        userId,
        title,
        content,
        isClosed,
        date,
        categoryId
      );

      if (tags.length > 0) {
        const newTags = await Promise.all(
          tags.map((tag: string) => addTag(tx, tag))
        );

        const formatedTags = newTags.map((tag: ITag) => ({
          tagId: tag.tagId,
          postId: post.postId,
        }));

        await addEventTags(tx, formatedTags);
      }

      if (images.length > 0) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formatedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await addEventImages(tx, formatedImages);
      }
    });

    res.status(StatusCodes.CREATED).json("게시글 등록");
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 수정
// [ ] 에러처리
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요
    const id = Number(req.params.community_id);
    const postId = Number(req.params.evnet_id);
    const categoryId = Number(req.query.category_id) || 1;

    const {
      title,
      content,
      isClosed,
      date,
      images,
      tags,
      newTags,
      deleteTagIds,
      newImages,
      deleteimageIds,
    } = req.body;

    if (
      !title ||
      !content ||
      !isClosed ||
      !date ||
      !images ||
      !tags ||
      !newTags ||
      !deleteTagIds ||
      !newImages ||
      !deleteimageIds
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateEventById(
        tx,
        userId,
        postId,
        title,
        content,
        isClosed,
        date,
        categoryId
      );

      await deleteEventTagByTagIds(tx, deleteTagIds);

      await deleteTags(tx, deleteTagIds);

      const tags = await Promise.all(
        newTags.map((tag: string) => addTag(tx, tag))
      );

      const formatedTags = tags.map((tag: ITag) => ({
        tagId: tag.tagId,
        postId: id,
      }));

      await addEventTags(tx, formatedTags);

      await deleteEventImagesByImageIds(tx, deleteimageIds);

      await deleteImages(tx, deleteimageIds);

      const images = await Promise.all(
        newImages.map((url: string) => addImage(tx, url))
      );

      const formatedImages = images.map((image: IImage) => ({
        imageId: image.imageId,
        postId: id,
      }));

      await addEventImages(tx, formatedImages);
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 수정되었습니다." });

    res.status(StatusCodes.OK).json("게시글 수정");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이벤트 게시판 게시글 삭제
// [ ] 관련 댓글 삭제
// [ ] 에러처리
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.evnet_id);
    const categoryId = Number(req.query.category_id) || 2;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const post = await getEventById(postId, categoryId);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "게시글을 찾을 수 없습니다." });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (post.eventTags?.length) {
        const tagIds = post.eventTags.map((item: ITag) => item.tagId);
        await deleteEventTagByTagIds(tx, tagIds);
        await deleteTags(tx, tagIds);
      }

      if (post.eventImages?.length) {
        const imageIds = post.eventImages.map((item: IImage) => item.imageId);
        await deleteEventImagesByImageIds(tx, imageIds);
        await deleteImages(tx, imageIds);
      }

      await deleteCommentsById(tx, postId);

      await removeEventById(tx, postId, userId, categoryId);
    });

    res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "게시글이 존재하지 않습니다" });
      }
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
