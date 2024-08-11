import { Prisma } from "@prisma/client";
import { addImage, deleteImages } from "../../model/images.model";
import { IImage, IImageBridge } from "../../types/image";
import { addImageFormats, deleteImageFormats, getImageFormatsByPostId } from "../../model/missing.model";
import { TCategoryId } from "../../types/category";
import { TPostData } from "../../types/post";

export const getAndDeleteImageFormats = async (
  tx: Prisma.TransactionClient,
  postData: TPostData
) => {
  const images = await getImageFormatsByPostId(tx, postData);
  await deleteImageFormats(tx, postData);
  return images;
}

export const deleteImagesByImageIds = async (
  tx: Prisma.TransactionClient,
  images: IImageBridge[]
) => {
  const formattedImages = images.map((image) => image.imageId);
  return await deleteImages(tx, formattedImages);
}