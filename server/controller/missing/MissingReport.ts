import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation } from "../../model/location.model";
import { addImageFormats, addLocationFormats, addMissingReport, removePost } from "../../model/missing.model";
import { getUserId, validateError } from "./Missing";
import { addImage } from "../../model/images.model";
import { IImage } from "../../types/image";
import { CATEGORY } from "../../constants/category";
import { deleteLocationsByLocationIds, getAndDeleteLocationFormats } from "../../util/locations/deleteLocationsByPostId";
import { deleteImagesByImageIds, getAndDeleteImageFormats } from "../../util/images/deleteImagesByPostId";
import { addNewImages } from "../../util/images/addNewImages";

/* CHECKLIST
* [ ] 사용자 정보 가져오기 반영
* [ ] 구현 내용
*   [x] create
*   [x] delete
*   [ ] get
*   [ ] 전체 조회 
*     [ ] 페이지네이션
*   [ ] put
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

export const deleteMissingReport = async (req: Request, res: Response) => {
  try {
    const missingId = Number(req.params.missingId);
    const postId = Number(req.params.postId);
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

    res
      .status(StatusCodes.OK)
      .json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    if (error instanceof Error)
      validateError(res, error);
  }
};