import { Prisma } from "@prisma/client";
import { TCategoryId } from "../../types/category";
import { getCategoryModel } from "./model";
import prisma from "../../client";
import { getCategory } from "../../constants/category";

export const getPostAuthorUuid = async (
  categoryId: TCategoryId,
  postId: number
): Promise<Buffer> => {
  const model = getCategory(categoryId);

  if (!model) throw new Error("부적절한 카테고리");

  const authorData = await (prisma as any)[model].findUnique({
    where: {
      postId
    },
    select: {
      uuid: true
    }
  })

  return authorData.uuid;
}