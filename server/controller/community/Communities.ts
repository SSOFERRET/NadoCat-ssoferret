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
import { addImage, deleteImages } from "../../model/image.model";
import { addTag, deleteTags } from "../../model/tag.model";
import { deleteCommentsById } from "../../model/communityComment.model";
import { handleControllerError } from "../../util/errors/errors";
import { CATEGORY } from "../../constants/category";
import { IImage } from "../../types/image";
import { ITag } from "../../types/tag";
import { removeLikesByIds } from "../../model/like.model";
import { notifyNewPostToFriends } from "../notification/Notifications";
import { deleteOpensearchDocument, indexOpensearchDocument, updateOpensearchDocument } from "../search/Searches";
import { incrementViewCountAsAllowed } from "../common/Views";
import { uploadImageToS3 } from "../../util/images/s3ImageHandler";
import { addNewImages } from "../../util/images/addNewImages";

// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] 페이지네이션 추가
// [x] 최신순 정렬
// [x] 조회순 정렬
// [x] 인기순 정렬
// [ ] 에러처리 자세하게 구현하기

//NOTE 사용자 정보를 받아오기 위한 임시 함수
export const getUserId = async () => {
  const result = await prisma.$queryRaw<{ HEX: Buffer }[]>`
    SELECT uuid AS HEX
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

// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] likes, liked 추가
// [x] 좋아요 수 구현
// [ ] 좋아요 관련 부분 코드 분리
// [ ] 에러처리 자세하게 구현하기

export const getCommunity = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const categoryId = CATEGORY.COMMUNITIES;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요
    const community = await getCommunityById(postId);

    if (!community) throw new Error("No Post"); //타입가드

    // // redis 서버 연결 필요하여 주석 처리함.
    // // 공동의 서버에는 나중에 설치할 예정
    // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.STREET_CATS, postId);
    // community.views += viewIncrementResult || 0;

    if (!community) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 좋아요 여부
    const liked = await prisma.likes.findFirst({
      where: {
        postId,
        categoryId,
        uuid: userId, // NOTE 타입 변환
      },
    });

    const result = {
      ...community,
      liked: !!liked,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    handleControllerError(error, res);
  }
};

// CHECKLIST
// [ ] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요
    const tagList = JSON.parse(tags);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
        await addCommunityImages(tx, formatedImages);
      }

      await notifyNewPostToFriends(userId, CATEGORY.COMMUNITIES, post.postId);

      await indexOpensearchDocument(CATEGORY.COMMUNITIES, title, content, post.postId);
    });

    res.status(StatusCodes.CREATED).json({ message: "게시글이 등록되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
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
    const userId = await getUserId();

    const { title, content, images, tags, newTags, deleteTagIds, newImages, deleteimageIds } = req.body;

    if (!title || !content || !images || !tags || !newTags || !deleteTagIds || !newImages || !deleteimageIds) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateCommunityById(tx, id, userId, title, content);

      await removeTagsByIds(tx, deleteTagIds);

      await deleteTags(tx, deleteTagIds);

      const tags = await Promise.all(newTags.map((tag: string) => addTag(tx, tag)));

      const formatedTags = tags.map((tag: ITag) => ({
        tagId: tag.tagId,
        postId: id,
      }));

      await addCommunityTags(tx, formatedTags);

      await removeTagsByIds(tx, deleteimageIds);

      await deleteImages(tx, deleteimageIds);

      const images = await Promise.all(newImages.map((url: string) => addImage(tx, url)));

      const formatedImages = images.map((image: IImage) => ({
        imageId: image.imageId,
        postId: id,
      }));

      await addCommunityImages(tx, formatedImages);

      await updateOpensearchDocument(CATEGORY.COMMUNITIES, id, { content });
    });

    res.status(StatusCodes.CREATED).json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// CHECKLIST
// [ ] 에러처리 자세하게 구현하기
// [ ] 사용자 정보 받아오는 부분 구현 필요
// [x] 테이블 변경에 따른 태그, 이미지 삭제 수정
// [x] 게시글 삭제 시 댓글 삭제 구현
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.community_id);
    const userId = await getUserId(); // NOTE 임시 값으로 나중에 수정 필요

    const post = await getCommunityById(postId);

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

      await removeCommunityById(tx, postId, userId);

      await deleteOpensearchDocument(CATEGORY.COMMUNITIES, postId);
    });

    res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};
