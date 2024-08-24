import { Prisma } from "@prisma/client";
import { addImage } from "../../model/image.model";
import { IImage, IProfileImage } from "../../types/image";
import { addImageFormats } from "../../model/missing.model";
import { IPostData } from "../../types/post";
// import { addProfileImageFormats } from "../../model/my.model";

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

// export const addProfileImages = async (
//     tx: Prisma.TransactionClient, 
//     uuid: string, 
//     imageUrl: string) => {
//     const newImage = await addImage(tx,imageUrl);
//     const uuidBuffer = Buffer.from(uuid.replace(/-/g, ""), "hex"); 
//     const formattedImage = {
//         imageId: newImage.imageId,
//         uuid: uuidBuffer,
//       };

//     await addProfileImageFormats(tx, formattedImage);
//     return newImage.imageId;
// }