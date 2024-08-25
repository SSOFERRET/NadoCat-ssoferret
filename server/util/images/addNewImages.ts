import { Prisma } from "@prisma/client";
import { addImage, addProfileImage } from "../../model/image.model";
import { IImage } from "../../types/image";
import { addImageFormats } from "../../model/missing.model";
import { IPostData } from "../../types/post";

export const addNewImages = async (
  tx: Prisma.TransactionClient,
  postData: IPostData,
  images: string[]
) => {
  const newImages = await Promise.all(
    images.map((url: string) => addImage(tx, url))
  );

  const formattedImages = newImages.map((image: IImage) => ({
    imageId: image.imageId,
    postId: postData.postId,
  }));

  await addImageFormats(tx, postData.categoryId, formattedImages);
  return formattedImages.map(image => image.imageId);
};

//프로필 이미지 변경
export const addProfileImages = async (uuid: string, imageUrl: string) => {
    const newImage = await addProfileImage(uuid, imageUrl);

    return newImage;
}