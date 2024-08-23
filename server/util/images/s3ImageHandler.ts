import { Request } from "express";
import { convertToWebpBuffer } from "./convertToWebpBuffer";
import s3 from "../../s3";
import dotenv from "dotenv";
import { TCategoryId } from "../../types/category";
import { getImageFormatsByPostId } from "../../model/missing.model";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import { getImageById } from "../../model/image.model";
import { IImage } from "../../types/image";
import { compressToEncodedURIComponent } from "lz-string";

dotenv.config();

export const uploadImagesToS3 = async (req: Request) => {
  if (!req.files) return;
  const images = req.files as Express.Multer.File[];
  try {
    const results = await Promise.all(images.map(async (image) => {
      const keyName = `${compressToEncodedURIComponent(image.originalname)}_${Date.now()}`;
      const result = await s3.upload({
        Bucket: "nadocat",
        Key: keyName,
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

const deleteImageFromS3 = async (images: IImage[]) => {
  try {
    await Promise.all(images.map(async (image) => {
      const urlSplit = image.url.split("/");
      const keyName = urlSplit[urlSplit.length - 1];
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: keyName
      }).promise()
    }))
  } catch (error) {
    throw error;
  }
}

export const deleteImageFromS3ByImageId = async (
  tx: Prisma.TransactionClient,
  imageIds: number[]
) => {
  const imageDatasToDelete = await Promise.all(imageIds.map(async (imageId: number) => await getImageById(tx, imageId)));
  await deleteImageFromS3(imageDatasToDelete as IImage[]);
}

export const getImageUrlsFromDb = async (categoryId: TCategoryId, postId: number) => {
  const imageUrls = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const imageIds = await getImageFormatsByPostId(tx, { categoryId, postId }).then((images) => images?.map(image => image.imageId)) as number[];

    const imageUrls = await Promise.all(imageIds?.map(async (imageId) => await getImageById(tx, imageId).then(data => data?.url)));

    return imageUrls;
  });
  return imageUrls
}