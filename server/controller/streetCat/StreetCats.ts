import { Request, Response, NextFunction } from "express";
import prisma from "../../client";
import { IImages, IStreetCatImages, IStreetCatPosts, IStreetCats } from "../../types/streetCat";
import { createLoction, createPost, createStreetCatImages, deleteAllStreetCatImages, deleteImages, deletePost, deleteStreetCatImages, deleteThumbnail, readLocation, readPost, readPosts, readPostsWithFavorites, readStreetCatImages, removeAllComment, removeAllFavoriteCat, updatePost } from "../../model/streetCat.model";
import { Prisma } from "@prisma/client";
import { notifyNewPostToFriends } from "../notification/Notifications";
import { CATEGORY } from "../../constants/category";
import { deleteOpensearchDocument, indexOpensearchDocument, indexResultToOpensearch, updateOpensearchDocument } from "../search/Searches";
import { incrementViewCountAsAllowed } from "../common/Views";
import { deleteImageFromS3ByImageId, uploadImagesToS3 } from "../../util/images/s3ImageHandler";
import { addNewImages } from "../../util/images/addNewImages";

// CHECKLIST
// [x] 페이지네이션 구현
// [x] 썸네일 어떻게 받아올지
// [ ] 에러 처리

// NOTE uuid 받아오는 임시함수 / 추후 삭제
export const getUuid = async () => {
  const result = await prisma.$queryRaw<{ "uuid": Buffer }[]>(
    Prisma.sql`SELECT uuid FROM users WHERE id = 1`
  )

  return result[0]['uuid'];
};

const categoryId = CATEGORY.STREET_CATS;

// 동네 고양이 도감 목록 조회
export const getStreetCats = async (req: Request, res: Response) => {
  // const uuid = await getUuid();
  const uuidString = req.headers["x-uuid"] as string;
  const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');

  console.log("uuidString: ", uuidString);
  console.log("uuid: ", uuid);

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
  // const uuid = await getUuid();
  const uuidString = req.headers["x-uuid"] as string;
  const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');

  console.log("uuidString: ", uuidString);
  console.log("uuid: ", uuid);
  const postId = Number(req.params.street_cat_id);

  try {
    await prisma.$transaction(async (tx) => {
      const getPost = await readPost(postId);
      const locationId = Number(getPost?.locationId);
      const getLocation = await readLocation(tx, locationId);
      const postData = {...getPost, location: getLocation};

      // if (!getPost) throw new Error("No Post"); // 타입 가드 필요해서 추가

      // redis 서버 연결 필요하여 주석 처리함. 
      // 공동의 서버에는 나중에 설치할 예정
      // const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.STREET_CATS, postId);
      // getPost.views += viewIncrementResult || 0;

      res.status(200).json(postData);
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 동네 고양이 도감 생성
export const createStreetCat = async (req: Request, res: Response) => {
  // const uuid = await getUuid();
  const uuidString = req.headers["x-uuid"] as string;
  const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');

  console.log("uuidString: ", uuidString);
  console.log("uuid: ", uuid);
  const { name, gender, neutered, discoveryDate, content } = req.body;
  const location = JSON.parse(req.body.location);
  const postData = { categoryId, name, gender, neutered, discoveryDate, content, uuid };
  
  try {
    const post = await prisma.$transaction(async (tx) => {
      // location 생성
      const newLocation = await createLoction(tx, location);
      const locationId = newLocation.locationId;

      // 도감 게시글 생성
      const newPost = await createPost(tx, postData, locationId);
      const postId = newPost.postId;

      // 도감 이미지 생성
      if (req.files) {
        // - uploadImagesToS3 사용해서 생성하고
        const images = await uploadImagesToS3(req);
        // - addNewImages 사용해서 생성
        const newImages = await addNewImages(
          tx,
          {
            userId: uuid,
            postId,
            categoryId: categoryId,
          },
          images || []
        );

        // 생성한 image_id, post_id 받기
        const getStreetCatImages = newImages.map((imageId: number) => ({
          imageId,
          postId
        }));

        // street_cat_images 데이터 생성
        await createStreetCatImages(tx, getStreetCatImages);
      }

      // await notifyNewPostToFriends(uuid, CATEGORY.STREET_CATS, postId);
      // await indexOpensearchDocument(CATEGORY.STREET_CATS, name, content, postId);

      return newPost;
    })
    res.status(201).json({ message: "동네 고양이 도감 생성" });

    await indexResultToOpensearch(CATEGORY.STREET_CATS, post.postId);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 수정
export const updateStreetCat = async (req: Request, res: Response) => {
  // const uuid = await getUuid();
  const uuidString = req.headers["x-uuid"] as string;
  const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');

  console.log("uuidString: ", uuidString);
  console.log("uuid: ", uuid);
  const { name, gender, neutered, discoveryDate, locationId, content, deleteImageIds } = req.body;
  const postId = Number(req.params.street_cat_id);
  const postData = { postId, categoryId, name, gender, neutered, discoveryDate, locationId, content, uuid };
  const imageIds = JSON.parse(deleteImageIds);

  try {
    await prisma.$transaction(async (tx) => {
      // 도감 게시글 수정
      const editPost = await updatePost(tx, postData);

      // 도감 이미지 생성
      if (req.files) {
        // - uploadImagesToS3 사용해서 생성하고
        const images = await uploadImagesToS3(req);
        // - addNewImages 사용해서 생성
        const newImages = await addNewImages(
          tx,
          {
            userId: uuid,
            postId,
            categoryId: categoryId,
          },
          images || []
        );

        const getStreetCatImages = newImages.map((imageId: number) => ({
          imageId,
          postId,
        }));
        
        await createStreetCatImages(tx, getStreetCatImages);
      }
      // 게시글에서 지운 이미지 삭제
      if (imageIds.length) {
        await deleteImageFromS3ByImageId(tx, imageIds);
        await deleteStreetCatImages(tx, imageIds);
        await deleteImages(tx, imageIds);
      }
      await updateOpensearchDocument(categoryId, postId, { content });

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
  // const uuid = await getUuid();
  const uuidString = req.headers["x-uuid"] as string;
  const uuid = Buffer.from(uuidString.replace(/-/g, ''), 'hex');

  console.log("uuidString: ", uuidString);
  console.log("uuid: ", uuid);
  const postId = Number(req.params.street_cat_id);

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const getStreetCatImages = await readStreetCatImages(postId);
      const imageIds = getStreetCatImages.map(image => image.imageId);

      console.log("imageIds", imageIds);

      await deleteImageFromS3ByImageId(tx, imageIds);
      await deleteAllStreetCatImages(tx, postId);
      await deleteThumbnail(tx, postId);
      await deleteImages(tx, imageIds);
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
