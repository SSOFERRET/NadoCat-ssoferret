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
  deleteCommunityImagesByImageIds,
  deleteCommunityTagByTagIds,
  updateCommunityById,
} from "../../model/community.model";
import { addImage, deleteImages } from "../../model/images.model";
import { addTag, deleteTags } from "../../model/tags.model";
import { IImage, ITag } from "../../types/community";

// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] 페이지네이션 추가
// [x] 최신순 정렬
// [x] 조회순 정렬
// [ ] 인기순 정렬
// [ ] 에러처리 자세하게 구현하기

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

//NOTE 사용자 정보를 받아오기 위한 임시 함수
export const getUserId = async () => {
  const result = await prisma.$queryRaw<{ HEX: string }[]>`
    SELECT HEX(uuid) AS HEX
    FROM users
    WHERE id = 1;
  `;

  if (!result) {
    throw new Error("사용자 정보 없음");
  }

  return result[0].HEX;
};

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const sort = req.query.sort?.toString() ?? "latest";
    const orderBy = getOrderBy(sort);
    const categoryId = Number(req.query.categoryId) || 1;
    const count = await getCommunitiesCount();

    const communities = await getCommunityList(
      categoryId,
      limit,
      orderBy,
      cursor
    );

    const nextCursor =
      communities.length === limit
        ? communities[communities.length - 1].postId
        : null;

    const result = {
      posts: communities,
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
// [x] 이미지 배열로 받아오게 DB 수정
// [x] likes, liked 추가
// [ ] 좋아요 관련 부분 코드 분리
// [ ] 에러처리 자세하게 구현하기

export const getCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.communityId);
    const categoryId = Number(req.query.categoryId) || 1;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const community = await getCommunityById(id, categoryId);

    if (!community) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 좋아요 수
    const likes = await prisma.likes.count({
      where: {
        postId: id,
        categoryId
      },
    });

    // 좋아요 여부
    const liked = await prisma.likes.findFirst({
      where: {
        postId: id,
        categoryId,
        uuid: Buffer.from(userId, "hex"), // NOTE 타입 변환
      },
    });

    const result = {
      ...community,
      likes,
      liked: !!liked,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// CHECKLIST
// [ ] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, images } = req.body;
    const categoryId = Number(req.query.categoryId) || 1;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await addCommunity(tx, userId, title, content, categoryId);

      if (tags.length > 0) {
        const newTags = await Promise.all(
          tags.map((tag: string) => addTag(tx, tag))
        );

        const formatedTags = newTags.map((tag: ITag) => ({
          tagId: tag.tagId,
          postId: post.postId,
        }));
        await addCommunityTags(tx, formatedTags);
      }

      if (images.length > 0) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formatedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await addCommunityImages(tx, formatedImages);
      }
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 등록되었습니다." });
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
// [ ] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.communityId);
    const categoryId = Number(req.query.categoryId) || 1;
    const userId = await getUserId();

    const {
      title,
      content,
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
      await updateCommunityById(tx, id, userId, categoryId, title, content);

      await deleteCommunityTagByTagIds(tx, deleteTagIds);

      await deleteTags(tx, deleteTagIds);

      const tags = await Promise.all(
        newTags.map((tag: string) => addTag(tx, tag))
      );

      const formatedTags = tags.map((tag: ITag) => ({
        tagId: tag.tagId,
        postId: id,
      }));

      await addCommunityTags(tx, formatedTags);

      await deleteCommunityImagesByImageIds(tx, deleteimageIds);

      await deleteImages(tx, deleteimageIds);

      const images = await Promise.all(
        newImages.map((url: string) => addImage(tx, url))
      );

      const formatedImages = images.map((image: IImage) => ({
        imageId: image.imageId,
        postId: id,
      }));

      await addCommunityImages(tx, formatedImages);
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

// CHECKLIST
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요
// [x] 테이블 변경에 따른 태그, 이미지 삭제 수정
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.communityId);
    const categoryId = Number(req.query.categoryId) || 1;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const post = await getCommunityById(id, categoryId);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "게시글을 찾을 수 없습니다." });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (post.communityTags?.length) {
        const tagIds = post.communityTags.map((item: ITag) => item.tagId);
        await deleteCommunityTagByTagIds(tx, tagIds);
        await deleteTags(tx, tagIds);
      }

      if (post.communityImages?.length) {
        const imageIds = post.communityImages.map(
          (item: IImage) => item.imageId
        );
        await deleteCommunityImagesByImageIds(tx, imageIds);
        await deleteImages(tx, imageIds);
      }

      await removeCommunityById(tx, id, userId, categoryId);
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
