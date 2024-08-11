import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation, updateLocationById } from "../../model/location.model";
import { addLocationFormats, addMissingReport, getPostByPostId, removePost, updateMissingReportByPostId } from "../../model/missing.model";
import { getUserId, validateError } from "./Missing";

import { CATEGORY } from "../../constants/category";
import { deleteLocationsByLocationIds, getAndDeleteLocationFormats } from "../../util/locations/deleteLocations";
import { deleteImagesByImageIds, getAndDeleteImageFormats } from "../../util/images/deleteImages";
import { addNewImages } from "../../util/images/addNewImages";

/* CHECKLIST
* [ ] 사용자 정보 가져오기 반영
* [ ] 구현 내용
*   [x] create
*   [x] delete
*   [ ] get
*   [ ] 전체 조회 
*     [ ] 페이지네이션
*   [x] put
*     [ ] 일치 및 불일치
*/

/**
 * 
 * CHECKLIST
 * [x] 이미지 가져오기
 * [x] location 가져오기
 */

export const createMissingReport = async (req: Request, res: Response) => {
  try {
    const missingId = Number(req.params.postId);
    const { report, location, images } = req.body;
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newLocation = await addLocation(tx, location);

      const userId = await getUserId(); //NOTE

      const post = await addMissingReport(tx, {
        ...report,
        uuid: userId,
        time: new Date(report.time),
        locationId: newLocation.locationId,
        missingId
      });

      await addLocationFormats(tx, CATEGORY.MISSING_REPORTS, {
        postId: post.postId,
        locationId: newLocation.locationId
      })

      if (images)
        await addNewImages(tx, {
          userId,
          postId: post.postId,
          categoryId: CATEGORY.MISSING_REPORTS,
        }, images)
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
 * DELETE
 * [x] location 삭제
 * [x] images 삭제
 *
 * */

export const deleteMissingReport = async (req: Request, res: Response, postIdInput?: number) => {
  const missingId = Number(req.params.missingId);
  const postId = postIdInput ? postIdInput : Number(req.params.postId);
  const userId = await getUserId(); // NOTE
  const postData = {
    userId,
    categoryId: CATEGORY.MISSING_REPORTS,
    postId
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const locations = await getAndDeleteLocationFormats(tx, postData);
    const images = await getAndDeleteImageFormats(tx, postData);

    await removePost(tx, postData);

    if (locations)
      await deleteLocationsByLocationIds(tx, locations);

    if (images)
      await deleteImagesByImageIds(tx, images);
  });
};

export const deleteMissingReportHandler = async (req: Request, res: Response) => {
  try {
    deleteMissingReport(req, res);
  } catch (error) {
    if (error instanceof Error)
      return validateError(res, error);
  }
};

export const updateMissingReport = async (req: Request, res: Response) => { // NOTE Full Update?인지 확인
  try {
    const postId = Number(req.params.postId);
    const userId = await getUserId(); // NOTE
    const { report, location, images } = req.body;
    const postData = {
      postId,
      userId,
      categoryId: CATEGORY.MISSING_REPORTS
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const post = await getPostByPostId(tx, postData);
      if (!post || !report || !location)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값 확인 요망" });

      const locationId = post.locationId;
      if (locationId)
        await updateLocationById(tx, locationId, location);

      await updateMissingReportByPostId(tx, postId, userId, report.detail, new Date(report.time))

      const imagesToDelete = await getAndDeleteImageFormats(tx, postData);

      if (imagesToDelete)
        await deleteImagesByImageIds(tx, imagesToDelete);

      if (images) {
        await addNewImages(tx, postData, images)
      };
    })

    return res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return validateError(res, error);
  }
};