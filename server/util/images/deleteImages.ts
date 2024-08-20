import { Prisma } from "@prisma/client";
import { deleteImages, getImageById } from "../../model/image.model";
import { IImageBridge } from "../../types/image";
import {
  deleteImageFormats,
  getImageFormatsByPostId,
} from "../../model/missing.model";
import { IPostData } from "../../types/post";

export const getAndDeleteImageFormats = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
) => {
  const images = await getImageFormatsByPostId(tx, postData);
  await deleteImageFormats(tx, postData);
  return images;
};

export const deleteImagesByImageIds = async (
  tx: Prisma.TransactionClient,
  images: IImageBridge[]
) => {
  const formattedImages = images.map((image) => image.imageId);
  return await deleteImages(tx, formattedImages);
};
