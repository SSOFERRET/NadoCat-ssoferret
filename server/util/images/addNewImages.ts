import { Prisma } from "@prisma/client";
import { addImage } from "../../model/images.model";
import { IImage } from "../../types/image";
import { addImageFormats } from "../../model/missing.model";
import { TPostData } from "../../types/post";

export const addNewImages = async (
  tx: Prisma.TransactionClient,
  postData: TPostData,
  images: string[]
) => {
  const newImages = await Promise.all(
    images.map((url: string) => addImage(tx, url))
  );

  const formattedImages = newImages.map((image: IImage) => ({
    imageId: image.imageId,
    postId: postData.postId
  }));

  await addImageFormats(tx, postData.categoryId, formattedImages);
};