import { Request, Response, NextFunction } from "express";
import prisma from "../../client";
import { IImages, IStreetCatImages } from "../../types/streetCat";
import { addImage, createFavoriteCat, createPost, createStreetCatImages, deleteAllStreetCatImages, deleteImages, deletePost, deleteStreetCatImages, readFavoriteCat, readFavoriteCatPostIds, readPost, readPosts, readPostsWithFavorites, readStreetCatImages, removeAllComment, removeAllFavoriteCat, removeComment, removeFavoriteCat, updatePost } from "../../model/streetCat.model";
import { Prisma } from "@prisma/client";
import { notifyNewPostToFriends } from "../notification/Notifications";
import { CATEGORY } from "../../constants/category";
import { deleteOpensearchDocument, indexOpensearchDocument, updateOpensearchDocument } from "../search/Searches";

// CHECKLIST
// [ ] 페이지네이션 구현
// [ ] 썸네일 어떻게 받아올지
// [ ] 에러 처리

// NOTE uuid 받아오는 임시함수 / 추후 삭제
export const getUuid = async () => {
  const result = await prisma.$queryRaw<{ "uuid": Buffer }[]>(
    Prisma.sql`SELECT uuid FROM users WHERE id = 1`
  )

  return result[0]['uuid'];
};

// 동네 고양이 도감 목록 조회
export const getStreetCats = async (req: Request, res: Response) => {
  const uuid = await getUuid();
  const limit = Number(req.query.limit);
  const cursor = Number(req.query.cursor);

  try {
    await prisma.$transaction(async (tx) => {
      if (uuid) {
        // 도감 목록 좋아요 유무
        const getPostsWithFavorites = await (isNaN(cursor)
          ? readPostsWithFavorites(tx, uuid, limit)
          : readPostsWithFavorites(tx, uuid, limit, cursor)
        );

        res.status(201).json(getPostsWithFavorites);
      } else {
        const getPosts = await (isNaN(cursor)
          ? readPosts(tx, limit)
          : readPosts(tx, limit, cursor)
        );

        res.status(201).json(getPosts);
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 상세 조회
export const getStreetCat = async (req: Request, res: Response) => {
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);

  try {
    await prisma.$transaction(async (tx) => {
      const getPost = await readPost(postId);

      res.status(200).json(getPost);
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 동네 고양이 도감 생성
export const createStreetCat = async (req: Request, res: Response) => {
  const { name, gender, neutered, discoveryDate, locationId, content, images } = req.body;
  // 임시 데이터
  const categoryId = 5;
  const uuid = await getUuid();

  const postData = { categoryId, name, gender, neutered, discoveryDate, locationId, content, uuid };

  try {
    await prisma.$transaction(async (tx) => {
      // 도감 게시글 생성
      const newPost = await createPost(tx, postData);

      // 도감 이미지 생성
      if (images.length) {
        // images 데이터 생성
        const createImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        // 생성한 image_id, post_id 받기
        const getStreetCatImages = createImages.map((image: IImages) => ({
          imageId: image.imageId,
          postId: newPost.postId
        }));

        // street_cat_images 데이터 생성
        await createStreetCatImages(tx, getStreetCatImages);

        await notifyNewPostToFriends(uuid, CATEGORY.STREET_CATS, newPost.postId);

        await indexOpensearchDocument(CATEGORY.STREET_CATS, name, content, newPost.postId);
      }

      res.status(201).json({ message: "동네 고양이 도감 생성" });
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 수정
export const updateStreetCat = async (req: Request, res: Response) => {
  const { name, gender, neutered, discoveryDate, locationId, content, addImages, deleteImageIds } = req.body;
  console.log(deleteImageIds)
  // 임시 데이터
  const categoryId = 5;
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);
  const postData = { postId, categoryId, name, gender, neutered, discoveryDate, locationId, content, uuid };

  try {
    await prisma.$transaction(async (tx) => {
      // 도감 게시글 수정
      const newPost = await updatePost(tx, postData);

      // 게시글에서 지운 이미지 삭제
      if (deleteImageIds.length) {
        await deleteStreetCatImages(tx, deleteImageIds);

        await deleteImages(tx, deleteImageIds);
      }

      // 도감 이미지 생성
      if (addImages.length) {
        // 새로 추가한 이미지 등록
        const createImages = await Promise.all(
          addImages.map((url: string) => addImage(tx, url))
        );

        // 생성한 image_id, post_id 받기
        const getStreetCatImages = createImages.map((image: IImages) => ({
          imageId: image.imageId,
          postId: newPost.postId
        }));

        // street_cat_images 데이터 생성
        await createStreetCatImages(tx, getStreetCatImages);

        await updateOpensearchDocument(categoryId, postId, { content });
      }

      res.status(201).json({ message: "동네 고양이 도감 수정" });
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 삭제
export const deleteStreetCat = async (req: Request, res: Response) => {
  // TODO: 로그인한 유저와 게시글 작성 유저가 같은지 판별 필요
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const getStreetCatImages = await readStreetCatImages(postId);
      const deleteImageIds = getStreetCatImages.map(image => image.imageId);

      await deleteAllStreetCatImages(tx, postId);

      await deleteImages(tx, deleteImageIds);

      await removeAllFavoriteCat(postId);

      await removeAllComment(postId);

      await deletePost(tx, postId, uuid);

      await deleteOpensearchDocument(CATEGORY.STREET_CATS, postId)

      // status 204는 message가 보내지지 않아 임시로 200
      res.status(200).json({ message: "동네 고양이 도감 삭제" });
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};