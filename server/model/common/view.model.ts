import { Prisma } from "@prisma/client";
import { getCategory } from "../../constants/category";
import { TCategoryId } from "../../types/category";

export const updateView = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  const model = getCategory(categoryId);
  if (!model) throw new Error("부적절한 카테고리");

  return await (tx as any)[model].update({
    where: {
      postId
    },
    data: {
      views: {
        increment: 1
      }
    }
  })
}