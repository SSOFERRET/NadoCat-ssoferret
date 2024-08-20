import { Request } from "express";
import { convertToWebpBuffer } from "./convertToWebpBuffer";
import s3 from "../../s3";
import dotenv from "dotenv";
import { TCategoryId } from "../../types/category";
import { getImageFormatsByPostId } from "../../model/missing.model";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { getImageById } from "../../model/image.model";

dotenv.config();

export const uploadImagesToS3 = async (req: Request, categoryId: number, postId: number) => {
  if (!req.files) return;
  const images = req.files as Express.Multer.File[];
  try {
    const results = await Promise.all(images.map(async (image, idx) => {
      const result = await s3.upload({
        Bucket: "nadocat",
        Key: `${categoryId}_${postId}_${idx}`,
        Body: await convertToWebpBuffer(image),
        ContentType: image.mimetype,
      }, (error, data) => {
        if (error) throw error;
        console.log(`파일 업로드 성공~! ${data.Location}`);
      }).promise();
      return result.Location;
    }));
    return results;
  } catch (error) {
    throw error;
  }
};

export const deleteImageFromS3 = async (categoryId: TCategoryId, postId: number, imageCount: number) => {
  try {
    for (let idx = 0; idx < imageCount; idx++)
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `${categoryId}_${postId}_${idx}`
      }).promise();
  } catch (error) {
    throw error;
  }
}

export const getImageUrlsFromDb = async (categoryId: TCategoryId, postId: number) => {
  const imageUrls = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const imageIds = await getImageFormatsByPostId(tx, { categoryId, postId }).then((images) => images?.map(image => image.imageId)) as number[];

    const imageUrls = await Promise.all(imageIds?.map(async (imageId) => await getImageById(tx, imageId).then(data => data?.url)));

    return imageUrls;
  });
  return imageUrls
}