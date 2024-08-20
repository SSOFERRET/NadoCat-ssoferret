import { Prisma } from "@prisma/client";
import prisma from "../client";
import { StatusCodes } from "http-status-codes";
import { deleteImageFromS3, getImageUrlsFromDb, uploadImageToS3 } from "../util/images/s3ImageHandler";
import { Request, Response } from "express";
import { addNewImages } from "../util/images/addNewImages";
import { getUserId } from "./missing/Missings";
import { deleteImagesByImageIds, getAndDeleteImageFormats } from "../util/images/deleteImages";
import { TCategoryId } from "../types/category";

export const updateS3Test = async (req: Request, res: Response) => {
  try {

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const userId = await getUserId();

      if (req.files) {
        const imageUrls = await uploadImageToS3(req, 3, 2) as any;
        console.log("결과 출력", imageUrls);
        await addNewImages(tx, {
          userId,
          postId: 2,
          categoryId: 3,
        }, imageUrls);
      } else {
        console.error("req.files 어디감?");
      }
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "s3 저장됨" });
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.BAD_REQUEST).end();
  }
};


export const deleteS3Test = async (req: Request, res: Response) => {
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const userId = await getUserId();
      const postData = {
        userId,
        postId: 2,
        categoryId: 3 as TCategoryId,
      }

      const images = await getAndDeleteImageFormats(tx, postData);

      if (images) {
        const deleteResult = await deleteImagesByImageIds(tx, images);
        deleteImageFromS3(3, 2, deleteResult.count);
      }
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "이미지 삭제됨." });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).end();
    console.error(error);
  }
};

export const getS3Test = async (req: Request, res: Response) => {
  try {
    const urls = await getImageUrlsFromDb(3, 2);
    res.status(StatusCodes.OK).json(urls);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).end();
    console.error(error);
  }
}
