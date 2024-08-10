import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserId } from "../community/Communities";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { addTag } from "../../model/tag.model";
import { IImage, ITag } from "../../types/community";
import { addImage } from "../../model/image.model";

// CHECKLIST
// [x] 이벤트 게시판 게시글 목록 가져오기
// [x] 페이지네이션 구현
// [x] 정렬 구현
// [ ] 좋아요 수와 좋아요 여부 구현
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

    const count = await prisma.events.count();

    const events = await prisma.events.findMany({
      where: {
        categoryId: categoryId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { postId: cursor } : undefined,
      orderBy: [
        {
          [orderBy.sortBy]: orderBy.sortOrder,
        },
        {
          postId: "asc",
        },
      ],

      select: {
        postId: true,
        categoryId: true,
        title: true,
        content: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        isClosed: true,
        users: {
          select: {
            id: true,
            uuid: true,
            nickname: true,
            profileImage: true,
          },
        },
        eventImages: {
          select: {
            images: {
              select: {
                imageId: true,
                url: true,
              },
            },
          },
        },
        eventTags: {
          select: {
            tags: {
              select: {
                tagId: true,
                tag: true,
              },
            },
          },
        },
      },
    });

    const temp = events.map((event: any) => {
      return {
        ...event,
        users: {
          id: event?.users.id,
          uuid: (event?.users.uuid as Buffer).toString("hex"),
          nickname: event?.users.nickname,
          profileImage: event?.users.profileImage,
        },
        eventTags: event.eventTags.map((item: any) => item.tags),
        eventImages: event.eventImages.map((item: any) => item.images),
      };
    });

    const nextCursor =
      temp.length === limit ? temp[temp.length - 1].postId : null;

    const result = {
      posts: temp,
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
// [ ] 이벤트 게시판 게시글 가져오기
// [ ] 에러처리
export const getEvent = async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json("이벤트 게시판 게시글 조회");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [ ] 이벤트 게시판 게시글 등록
// [ ] 에러처리
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, content, isClosed, date, tags, images } = req.body;
    const categoryId = Number(req.query.category_id) || 2;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await tx.events.create({
        data: {
          title,
          content,
          isClosed: isClosed ? 1 : 0,
          categoryId,
          uuid: Buffer.from(userId, "hex"),
          date,
        },
      });

      if (tags.length > 0) {
        const newTags = await Promise.all(
          tags.map((tag: string) => addTag(tx, tag))
        );

        const formatedTags = newTags.map((tag: ITag) => ({
          tagId: tag.tagId,
          postId: post.postId,
        }));

        await tx.eventTags.createMany({
          data: formatedTags,
        });
      }

      if (images.length > 0) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formatedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await tx.eventImages.createMany({
          data: formatedImages,
        });
      }
    });

    res.status(StatusCodes.CREATED).json("게시글 등록");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [ ] 이벤트 게시판 게시글 수정
// [ ] 에러처리
export const updateEvent = async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json("게시글 수정");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [ ] 이벤트 게시판 게시글 삭제
// [ ] 에러처리
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json("게시글 삭제");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
