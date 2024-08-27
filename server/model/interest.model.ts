import prisma from "../client";

export const getLikedPostIds = async (userUuidBuffer: Buffer) => {
  const liked = await prisma.likes.findMany({
    where: {
      uuid: userUuidBuffer,
    },
    select: {
      postId: true,
    },
  });

  return liked.map((like) => like.postId);
};

export const getInterestPosts = async (postIds: number[]) => {
  return prisma.communities.findMany({
    where: {
      postId: {
        in: postIds,
      },
    },
    include: {
      communityImages: {
        select: {
          images: {
            select: {
              url: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        },
      },
      communityTags: {
        select: {
          tags: true,
        },
      },
      _count: {
        select: {
          communityLikes: true,
        },
      },
    },
  });
};
