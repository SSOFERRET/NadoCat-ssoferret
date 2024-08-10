import { Prisma } from "@prisma/client";
import prisma from "../client";
import { ICommunity, ICommunityImage, ICommunityTag, IImage, ITag } from "../types/community";

export const getCommunitiesCount = async () => await prisma.communities.count();

export const getCommunityList = async (
  categoryId: number,
  limit: number,
  orderBy: { sortBy: string; sortOrder: string },
  cursor: number | undefined
) => {
  const communities = await prisma.communities.findMany({
    where: {
      categoryId: categoryId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { postId: cursor } : undefined,
    orderBy: [
      {
        [orderBy.sortBy]: orderBy.sortOrder,
      },
      {
        postId: "desc",
      },
    ],

    select: {
      postId: true,
      categoryId: true,
      title: true,
      content: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        },
      },
      communityImages: {
        select: {
          images: {
            select: {
              imageId: true,
              url: true,
            },
          },
        },
      },
      communityTags: {
        select: {
          tags: {
            select: {
              tagId: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  return communities.map((community: ICommunity) => {
    return {
      ...community,
      users: {
        id: community?.users.id,
        uuid: (community?.users.uuid as Buffer).toString("hex"),
        nickname: community?.users.nickname,
        profileImage: community?.users.profileImage,
      },
      communityTags: community.communityTags.map((item: ICommunityTag) => item.tags),
      communityImages: community.communityImages.map(
        (item: ICommunityImage) => item.images
      ),
    };
  });
};

export const getCommunityById = async (postId: number, categoryId: number) => {
  const community = await prisma.communities.findUnique({
    where: {
      postId: postId,
      categoryId: categoryId,
    },
    select: {
      postId: true,
      categoryId: true,
      title: true,
      content: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        },
      },
      communityImages: {
        select: {
          images: {
            select: {
              imageId: true,
              url: true,
            },
          },
        },
      },
      communityTags: {
        select: {
          tags: {
            select: {
              tagId: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  if (!community) {
    return null;
  }

  return {
    ...community,
    users: {
      id: community?.users.id,
      uuid: (community?.users.uuid as Buffer).toString("hex"),
      nickname: community?.users.nickname,
      profileImage: community?.users.profileImage,
    },
    communityTags: community?.communityTags.map(
      (item: ICommunityTag) => item.tags
    ),
    communityImages: community?.communityImages.map(
      (item: ICommunityImage) => item.images
    ),
  };
};

export const addCommunity = async (
  tx: Prisma.TransactionClient,
  userId: string,
  title: string,
  content: string,
  categoryId: number
) =>
  await tx.communities.create({
    data: {
      uuid: Buffer.from(userId, "hex"),
      title,
      content,
      categoryId: categoryId,
    },
  });

export const updateCommunityById = async (
  tx: Prisma.TransactionClient,
  postId: number,
  userId: string,
  categoryId: number,
  title: string,
  content: string
) => {
  return await tx.communities.update({
    where: {
      postId: postId,
      uuid: Buffer.from(userId, "hex"),
      categoryId: categoryId,
    },
    data: {
      title,
      content,
    },
  });
};

export const removeCommunityById = async (
  tx: Prisma.TransactionClient,
  postId: number,
  userId: string,
  categoryId: number
) => {
  return await tx.communities.delete({
    where: {
      postId: postId,
      uuid: Buffer.from(userId, "hex"),
      categoryId: categoryId,
    },
  });
};

export const addCommunityTags = async (
  tx: Prisma.TransactionClient,
  tags: {
    postId: number;
    tagId: number;
  }[]
) => {
  return await tx.communityTags.createMany({
    data: tags,
  });
};

export const addCommunityImages = async (
  tx: Prisma.TransactionClient,
  images: {
    postId: number;
    imageId: number;
  }[]
) => {
  return await tx.communityImages.createMany({
    data: images,
  });
};

export const deleteCommunityTagByTagIds = async (
  tx: Prisma.TransactionClient,
  tagIds: number[]
) => {
  return await tx.communityTags.deleteMany({
    where: {
      tagId: {
        in: tagIds,
      },
    },
  });
};

export const deleteCommunityTagByTagId = async (
  tx: Prisma.TransactionClient,
  tagId: number
) => {
  return await tx.communityTags.delete({
    where: {
      tagId: tagId,
    },
  });
};

export const deleteCommunityByPostIds = async (
  tx: Prisma.TransactionClient,
  postIds: number[]
) => {
  return await tx.communityTags.deleteMany({
    where: {
      postId: {
        in: postIds,
      },
    },
  });
};

export const deleteCommunityImagesByImageIds = async (
  tx: Prisma.TransactionClient,
  imageIds: number[]
) => {
  return await tx.communityImages.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
};
