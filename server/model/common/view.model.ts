import { Prisma } from "@prisma/client";
import { TCategoryId } from "../../types/category";

export const updateView = async (
  tx: Prisma.TransactionClient,
  categoryId: TCategoryId,
  postId: number
) => {
  try {
    switch (categoryId) {
      case 1: return await tx.communities.update({
        where: {
          postId
        },
        data: {
          views: {
            increment: 1
          }
        }
      });
      case 2: return await tx.events.update({
        where: {
          postId
        },
        data: {
          views: {
            increment: 1
          }
        }
      });
      case 3: return await tx.missings.update({
        where: {
          postId
        },
        data: {
          views: {
            increment: 1
          }
        }
      });
      case 5: return await tx.streetCats.update({
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

  } catch (error) {
    console.error(error);
  }
}