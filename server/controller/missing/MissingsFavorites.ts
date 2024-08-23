import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * 
 */
export const getMissingFavorites = async (req: Request, res: Response) => {
  try {
    const favoriteId = await prisma.missingFavorites.findMany({
      where: {
        uuid: Buffer.from("test", "hex")
      }
    }).then((favorites) => favorites.map((favorite) => favorite.postId));

    const results = await prisma.missings.findMany({
      where: {
        postId: {
          in: favoriteId
        }
      },
      include: {
        boardCategories: true,
        users: true,
        locations: true,
      }
    })
    res.json(results);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * 
 */

export const postMissingFavorites = async (req: Request, res: Response) => {
  const postId = Number(req.body.postId);
  try {
    const result = await prisma.missingFavorites.create({
      data: {
        uuid: Buffer.from("test", "hex"),
        postId: postId,
      }
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * - [ ] delete 메서드 스타일에 대한 합의
 */

export const deleteMissingFavorites = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  console.log(postId);
  try {
    const result = await prisma.missingFavorites.deleteMany({
      where: {
        // missingFavoriteId: undefined,
        uuid: Buffer.from("test", "hex"),
        postId: postId
      }
    })
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};