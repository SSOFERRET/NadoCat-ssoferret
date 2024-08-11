import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation, getLocationById, updateLocationById } from "../../model/location.model";
import { addMissing, addLocationFormats, removePost, updateMissingByPostId, updateFoundByPostId, getMissingReportsByMissingId, getPostByPostId, getLocationFormatsByPostId, getImageFormatsByPostId } from "../../model/missing.model";
import { CATEGORY } from "../../constants/category";
import { addNewImages } from "../../util/images/addNewImages";
import { deleteImagesByImageIds, getAndDeleteImageFormats } from "../../util/images/deleteImages";
import { deleteLocationsByLocationIds, getAndDeleteLocationFormats } from "../../util/locations/deleteLocations";
import { deleteMissingReport } from "./MissingReport";
import { getImageById } from "../../model/image.model";


/* CHECKLIST
* [ ] 사용자 정보 가져오기 반영
* [ ] 구현 내용
*   [x] create
*   [x] delete
*   [-] get
*   [x] put
*/

/**
 * 
 * CHECKLIST
 * [ ] 이미지 가져오기
 * [ ] location 가져오기
 * [ ] 제보글 가져오기
 */

export const getMissing = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const userId = await getUserId(); // NOTE
      const postData = {
        postId,
        categoryId: CATEGORY.MISSINGS,
        userId
      }

      let post = await getPostByPostId(tx, postData);

      const locationFormats = await getLocationFormatsByPostId(tx, postData);
      if (locationFormats) {
        const locations = await Promise.all(locationFormats.map((locationFormat) => getLocationById(tx, locationFormat.locationId)));
        post = { ...post, locations };
      }

      const imageFormats = await getImageFormatsByPostId(tx, postData);
      if (imageFormats) {
        const images = await Promise.all(imageFormats.map((imageFormat) => getImageById(tx, imageFormat.imageId)));
        post = { ...post, images };
      }

      return res
        .status(StatusCodes.CREATED)
        .json(post);
    });
  } catch (error) {
    if (error instanceof Error)
      validateError(res, error);
  }
};

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
        await addNewImages(tx, {
          userId,
          postId: post.postId,
          categoryId: CATEGORY.MISSINGS,
        }, images)
      }
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 등록되었습니다." });
  } catch (error) {
    if (error instanceof Error)
      validateError(res, error);
  }
};

/**
 * CHECKLIST
 * [x] location 삭제
 * [x] images 삭제
 * [x] 제보글 삭제
 *
 * */

export const deleteMissing = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const userId = await getUserId(); // NOTE
    const postData = {
      userId,
      postId,
      categoryId: CATEGORY.MISSINGS
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const missingReports = await getMissingReportsByMissingId(tx, postId);

      if (missingReports)
        await Promise.all(
          missingReports.map((report) => deleteMissingReport(req, res, report.postId))
        );

      const locations = await getAndDeleteLocationFormats(tx, postData);
      const images = await getAndDeleteImageFormats(tx, postData);

      await removePost(tx, postData);

      if (locations)
        await deleteLocationsByLocationIds(tx, locations);

      if (images)
        await deleteImagesByImageIds(tx, images);
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return validateError(res, error);
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
 * [x] 상태 수정
 * [ ] 조회수 업데이트?
 */

export const updateMissing = async (req: Request, res: Response) => { // NOTE Full Update?인지 확인
  try {
    const postId = Number(req.params.postId);
    const userId = await getUserId(); // NOTE
    const { missing, location, images } = req.body;
    const postData = {
      postId,
      userId,
      categoryId: CATEGORY.MISSINGS
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await getPostByPostId(tx, postData);
      if (!post || !missing.catId || !missing.time || !location || !missing.detail)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값 확인 요망" });

      const locationId = post.locationId;
      if (locationId)
        await updateLocationById(tx, locationId, location);

      await updateMissingByPostId(tx, postId, userId, missing.catId, missing.detail, new Date(missing.time))

      const imagesToDelete = await getAndDeleteImageFormats(tx, postData);

      if (imagesToDelete)
        await deleteImagesByImageIds(tx, imagesToDelete);

      if (images) {
        await addNewImages(tx, {
          userId,
          postId,
          categoryId: CATEGORY.MISSINGS,
        }, images)
      };
    })

    return res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    if (error instanceof Error)
      return validateError(res, error);
  }
};

export const validateBadRequest = (res: Response, error: Error) => {
  console.error(error);
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "입력값을 확인해 주세요." });
}

export const validateInternalServerError = (res: Response) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
}

export const validateError = (res: Response, error: Error) => {
  if (error instanceof Prisma.PrismaClientValidationError)
    return validateBadRequest(res, error);
  return validateInternalServerError(res);
}

export const updateFoundState = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);
    const userId = await getUserId(); // NOTE
    const { found } = req.body;
    const postData = {
      postId,
      userId,
      categoryId: CATEGORY.MISSINGS
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateFoundByPostId(tx, postData, found);
    })

    return res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 상태가 변경 되었습니다." });
  } catch (error) {
    if (error instanceof Error)
      return validateError(res, error);
  }
}