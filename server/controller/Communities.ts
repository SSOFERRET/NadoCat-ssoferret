import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../client";
import { Prisma } from "@prisma/client";

// TODO: 목록 조회 - 이미지 배열로 받아오게 수정(DB를 변경해야 함), ✅페이지네이션 추가, 정렬 추가(✅최신순, ✅조회순, 인기순)

const getOrderBy = (sort: string) => {
  switch (sort) {
    case "latest":
      return { sortBy: "created_at", sortOrder: "asc" };
    case "views":
      return { sortBy: "views", sortOrder: "desc" };
    case "likes":
      return { sortBy: "likes", sortOrder: "desc" }; // 테이블 수정 필요
    default:
      throw new Error("일치하는 정렬 기준이 없습니다.");
  }
};

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const sort = req.query.sort?.toString() ?? "latest";
    const orderBy = getOrderBy(sort);
    const categoryId = Number(req.query.category_id) || 1;
    const count = await prisma.communities.count();
    const communities = await prisma.communities.findMany({
      where: {
        category_id: categoryId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { post_id: cursor } : undefined,
      orderBy: [
        {
          [orderBy.sortBy]: orderBy.sortOrder,
        },
        {
          post_id: "asc",
        },
      ],
      select: {
        post_id: true,
        category_id: true,
        title: true,
        content: true,
        views: true,
        created_at: true,
        updated_at: true,
        thumbnail: true,
        users: {
          select: {
            id: true,
            user_id: true,
            name: true,
            profile_image: true,
          },
        },
        images: {
          take: 1,
          select: {
            image_id: true,
            url: true,
          },
          orderBy: {
            image_id: "asc",
          },
        },
        tags: {
          select: {
            tag_id: true,
            tag: true,
          },
        },
      },
    });

    const nextCursor =
      communities.length === limit
        ? communities[communities.length - 1].post_id
        : null;

    const result = {
      posts: communities,
      nextCursor,
      totalCount: count,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// TODO: 상세 조회 - 이미지 배열로 받아오게 수정하기(DB를 변경해야 함)
export const getCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const community = await prisma.communities.findUnique({
      where: {
        post_id: id,
        category_id: 1,
      },
      select: {
        post_id: true,
        category_id: true,
        title: true,
        content: true,
        views: true,
        created_at: true,
        updated_at: true,
        users: {
          select: {
            id: true,
            user_id: true,
            name: true,
            profile_image: true,
          },
        },
        images: {
          where: {
            post_id: id,
            category_id: 1,
          },
          select: {
            image_id: true,
            url: true,
          },
          orderBy: {
            image_id: "asc",
          },
        },
        tags: {
          where: {
            post_id: id,
            category_id: 1,
          },
          select: {
            tag_id: true,
            tag: true,
          },
          orderBy: {
            tag_id: "asc",
          },
        },
      },
    });

    if (!community) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 게시글 입니다." });
    }

    res.status(StatusCodes.OK).json(community);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// TODO: 게시글 작성, 이미지 업로드 수정 필요
export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, images } = req.body;
    const categoryId = Number(req.query.category_id) || 1;
    const userId = "aaa"; // 임시 값

    const addPost = await prisma.communities.create({
      data: {
        user_id: userId,
        title,
        content,
      },
    });

    const formatedTag = tags.map((tag: string) => ({
      tag,
      category_id: categoryId,
      post_id: addPost.post_id,
    }));

    await prisma.tags.createMany({
      data: formatedTag,
    });

    const formatedImages = images.map((image: string) => ({
      url: image,
      post_id: addPost.post_id,
      category_id: categoryId,
    }));

    await prisma.images.createMany({
      data: formatedImages,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// TODO: 게시글 수정, 이미지 업로드 수정 필요
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const categoryId = Number(req.query.category_id) || 1;
    const {
      title,
      content,
      images,
      tags,
      newTags,
      deleteTags,
      newImages,
      deleteImages,
    } = req.body;

    if (
      !title ||
      !content ||
      !images ||
      !tags ||
      !newTags ||
      !deleteTags ||
      !newImages ||
      !deleteImages
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    // 게시글 수정
    await prisma.communities.update({
      where: {
        post_id: id,
      },
      data: {
        title,
        content,
      },
    });

    // 태그 삭제
    await prisma.tags.deleteMany({
      where: {
        post_id: id,
        category_id: categoryId,
        tag_id: {
          in: deleteTags,
        },
      },
    });

    const formatedTag = newTags.map((tag: string) => ({
      tag,
      category_id: categoryId,
      post_id: id,
    }));

    // 태그 추가
    await prisma.tags.createMany({
      data: formatedTag,
    });

    // 이미지 삭제
    await prisma.images.deleteMany({
      where: {
        post_id: id,
        category_id: categoryId,
        image_id: {
          in: deleteImages,
        },
      },
    });

    const formatedImages = newImages.map((image: string) => ({
      url: image,
      category_id: categoryId,
      post_id: id,
    }));

    // 이미지 추가
    await prisma.images.createMany({
      data: formatedImages,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// TODO: 게시글 삭제
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const categoryId = Number(req.query.category_id) || 1;

    await prisma.tags.deleteMany({
      where: {
        post_id: id,
        category_id: categoryId,
      },
    });

    await prisma.images.deleteMany({
      where: {
        post_id: id,
        category_id: categoryId,
      },
    });

    await prisma.communities.delete({
      where: {
        post_id: id,
      },
    });

    res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "게시글이 존재하지 않습니다" });
      }
    }

    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
