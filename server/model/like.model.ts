import { Prisma } from "@prisma/client";

export const removeLikesByIds = async (
  tx: Prisma.TransactionClient,
  likeIds: { likeId: number }[]
) => {
  await tx.likes.deleteMany({
    where: {
      likeId: {
        in: likeIds.map((like) => like.likeId),
      },
    },
  });
};
