import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation } from "../../model/location.model";
import { addMissing, addMissingImages } from "../../model/missing.model";
import { addImage } from "../../model/images.model";
import { IImage } from "../../types/community";

/* CHECKLIST
* - [ ] 사용자 정보 가져오기 반영
* - [ ] 구현 내용
*   - [ ] create
*   - [ ] delete
*   - [ ] get
*   - [ ] put
*/

export const getMissing = async (req: Request, res: Response) => {
  try {
    const results = await prisma.missings.findMany({
      include: {
        boardCategories: true,
        users: true,
        locations: true,
      }
    });
    res.json(results);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const createMissing = async (req: Request, res: Response) => {
  try {
    const { missing, location, images } = req.body;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newLocation = await addLocation(tx, location);
      const userId = await getUserId();

      const post = await addMissing(tx,
        {
          ...missing,
          uuid: userId,
          time: new Date(missing.time),
          locationId: newLocation.locationId,
        }
      );

      if (images.length) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formatedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await addMissingImages(tx, formatedImages);
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

const getUserId = async () => { // 임시
  const result = await prisma.users.findUnique({
    where: {
      id: 1
    }
  });

  if (!result) {
    throw new Error("사용자 정보 없음");
  }
  console.log(result.uuid);
  return result.uuid;
};


