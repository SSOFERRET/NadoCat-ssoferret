import { Request, Response } from "express";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { getUuid } from "./StreetCats";
import { createFavoriteCat, readFavoriteCat, readFavoriteCatPostIds, readFavoriteCatPosts, removeFavoriteCat } from "../../model/streetCat.model";

// CHECKLIST
// [ ] response 정돈
// [ ] 에러 처리

// 동네 고양이 도감 즐겨찾기(내 도감) 목록 조회
// TODO: 테이블에 created_At 컬럼 추가되면 최신순 정렬
export const getFavoriteCats = async (req: Request, res: Response) => {
  const uuid = await getUuid();

  await prisma.$transaction(async (tx) => {
    const getFavoritePostIds = await readFavoriteCatPostIds(tx, uuid);

    const postIds = getFavoritePostIds.map((post) => {return post.postId});

    const getFavoriteCatPosts = await readFavoriteCatPosts(tx, uuid, postIds);
    
    res.status(200).json(getFavoriteCatPosts);
  })
}

// // 동네 고양이 도감 즐겨찾기(내 도감) postId 목록 조회
// export const getFavoriteCatsPostIds = async (req: Request, res: Response) => {
//   const uuid = await getUuid();

//   await prisma.$transaction(async (tx) => {
//     const getFavoriteCatPostIds = await readFavoriteCatPostIds(tx, uuid);

//   res.status(200).json(getFavoriteCatPostIds);
//   });
// }

// 동네 고양이 도감 즐겨찾기(내 도감) 조회
export const getFavoriteCat = async (req: Request, res: Response) => {
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);

  const getFavoriteCat = await readFavoriteCat(uuid, postId);

  res.status(200).json(getFavoriteCat);
}

// 동네 고양이 도감 즐겨찾기(내 도감) 추가 
export const addFavoriteCat = async (req: Request, res: Response) => {
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);

  try {
    await createFavoriteCat(uuid, postId);
    
    res.status(200).json({ message: "내 도감 추가" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 동네 고양이 도감 즐겨찾기(내 도감) 삭제
export const deleteFavoriteCat = async (req: Request, res: Response) => {
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);

  try {
    await removeFavoriteCat(uuid, postId);
    
    res.status(200).json({ message: "내 도감 삭제" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}