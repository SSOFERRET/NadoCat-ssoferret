import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation, deleteLocations, updateLocationById } from "../../model/location.model";
import { addMissing, addLocationFormats, addImageFormats, getLocationFormatsByPostId, getImageFormatsByPostId, deleteImageFormats, deleteLocationFormats, removePost, updateMissingByPostId, getMissingByPostId } from "../../model/missing.model";
import { addImage, deleteImages } from "../../model/images.model";
import { IImage } from "../../types/image";
import { CATEGORY } from "../../constants/category";


/* CHECKLIST
* [ ] 사용자 정보 가져오기 반영
* [ ] 구현 내용
*   [x] create
*   [-] delete
*   [-] get
*   [ ] put
*/

/**
 * 
 * CHECKLIST
 * [ ] 이미지 가져오기
 * [ ] location 가져오기
 * [ ] 제보글 가져오기
 */

/**CHECKLIST
 * [x] missing_locations table에 추가 누락
*/

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

      await addLocationFormats(tx, CATEGORY.MISSINGS, {
        postId: post.postId,
        locationId: newLocation.locationId
      });

      if (images) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formattedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await addImageFormats(tx, CATEGORY.MISSINGS, formattedImages);
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

/**
 * CHECKLIST
 * [x] location 삭제
 * [x] images 삭제
 * [ ] 제보글 삭제
 *
 * */


export const deleteMissing = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const userId = await getUserId(); // NOTE 사용자 정보 인가 

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const locations = await getLocationFormatsByPostId(tx, CATEGORY.MISSINGS, postId);
      const images = await getImageFormatsByPostId(tx, CATEGORY.MISSINGS, postId);

      await deleteLocationFormats(tx, CATEGORY.MISSING_REPORTS, postId);
      await deleteImageFormats(tx, CATEGORY.MISSINGS, postId);

      await removePost(tx, CATEGORY.MISSINGS, postId);

      if (locations) {
        const formattedLocations = locations.map(location => location.locationId);
        await deleteLocations(tx, formattedLocations);
      }

      if (images) {
        const formattedImages = images.map((image) => image.imageId);
        await deleteImages(tx, formattedImages);
      }
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 삭제되었습니다." });
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

export const getUserId = async () => { // 임시
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

/**
 * CHECKLIST
 * Update
 * [x] 이미지 수정
 * [x] 위치 수정
 * [x] 내용 수정
 * 
 * [ ] 상태 수정
 * [ ] 조회수 업데이트?
 */

export const updateMissing = async (req: Request, res: Response) => { // NOTE Full Update?인지 확인
  try {
    const postId = Number(req.params.postId);
    const userId = await getUserId(); // NOTE
    const { missing, location, images } = req.body;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await getMissingByPostId(tx, postId);
      if (!post || !missing.catId || !missing.time || !location || !missing.detail)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값 확인 요망" });

      const locationId = post.locationId;
      if (locationId)
        await updateLocationById(tx, locationId, location);

      await updateMissingByPostId(tx, postId, userId, missing.catId, missing.detail, new Date(missing.time))

      const imagesToDelete = await getImageFormatsByPostId(tx, CATEGORY.MISSINGS, postId);
      await deleteImageFormats(tx, CATEGORY.MISSINGS, postId);
      if (imagesToDelete) {
        const formattedImages = imagesToDelete.map((image) => image.imageId);
        await deleteImages(tx, formattedImages);
      }

      if (images) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formattedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await addImageFormats(tx, CATEGORY.MISSINGS, formattedImages);
      }
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 수정되었습니다." });
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
