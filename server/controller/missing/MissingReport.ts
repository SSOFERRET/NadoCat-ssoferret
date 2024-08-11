import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation, deleteLocations } from "../../model/location.model";
import { addImageFormats, addLocationFormats, addMissingReport, deleteImageFormats, deleteLocationFormats, getImageFormatsByPostId, getLocationFormatsByPostId, removePost } from "../../model/missing.model";
import { getUserId } from "./Missing";
import { addImage, deleteImages } from "../../model/images.model";
import { IImage, IImageBridge } from "../../types/image";
import { CATEGORY } from "../../constants/category";

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

      if (images) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(tx, url))
        );

        const formattedImages = newImages.map((image: IImage) => ({
          imageId: image.imageId,
          postId: post.postId,
        }));

        await addImageFormats(tx, CATEGORY.MISSING_REPORTS, formattedImages);
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

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const locations = await getLocationFormatsByPostId(tx, CATEGORY.MISSING_REPORTS, postId);
      const images = await getImageFormatsByPostId(tx, CATEGORY.MISSING_REPORTS, postId);

      await deleteLocationFormats(tx, CATEGORY.MISSING_REPORTS, postId);
      await deleteImageFormats(tx, CATEGORY.MISSING_REPORTS, postId);

      await removePost(tx, CATEGORY.MISSING_REPORTS, postId);

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