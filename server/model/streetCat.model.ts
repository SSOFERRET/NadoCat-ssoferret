import { Prisma } from "@prisma/client";
import prisma from "../client"
import { IImages, IStreetCatImages, IStreetCatPost, IStreetCats } from "../types/streetCat"

// NOTE: 함수명 통일성 필요 (ex. delete | remove 중에 통일)

export const readPosts = async (tx: Prisma.TransactionClient, limit: number, cursor?: number) => {
  console.log("readPosts()");
  const streetCatPosts = await prisma.streetCats.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { postId: cursor } }),
    orderBy: {
      createdAt: "desc"
    },
    include: {
      streetCatImages: {
        take: 1,
        select: {
          images: {
            select: {
              url: true
            }
          }
        }
      },
    }
  })

  return {
    streetCatPosts
  }
}

export const readPostsWithFavorites = async (tx: Prisma.TransactionClient, uuid: Buffer, limit: number, cursor?: number) => {
  const streetCatPosts = await prisma.streetCats.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { postId: cursor } }),
    orderBy: {
      createdAt: "desc"
    },
    include: {
      streetCatImages: {
        take: 1,
        select: {
          images: {
            select: {
              url: true
            }
          }
        }
      },
      streetCatFavorites: {
        where: {
          uuid
        },
        select: {
          postId: true
        }
      }
    }
  })

  // return streetCatPosts.map((post) => {
  //   return {
  //     postId: post.postId,
  //     categoryId: post.categoryId,
  //     createdAt: post.createdAt,
  //     gender: post.gender,
  //     name: post.name,
  //     thumbnail: post.streetCatImages.length > 0 ? post.streetCatImages[0].images.url : null,
  //     isFavorite: post.streetCatFavorites.length > 0,
  //   }
  // });
  return {
    streetCatPosts
  }
}

export const readPost = async (postId: number) => {
  const streetCatPost = await prisma.streetCats.findUnique({
    where: {
      postId: postId
    },
    select: {
      postId: true,
      categoryId: true,
      name: true,
      gender: true,
      neutered: true,
      discoveryDate: true,
      locationId: true,
      content: true,
      views: true,
      // uuid: true,
      createdAt: true,
      streetCatImages: {
        select: {
          images: {
            select: {
              imageId: true,
              url: true,
            }
          }
        }
      },
      users: {
        select: {
          uuid: true,
          nickname: true,
          profileImage: true
        }
      },
      streetCatFavorites: {
        where: {
          postId
        },
        select: {
          postId: true
        }
      },
    },
  })

  if (!streetCatPost) { return null };

  const steetCatImages = streetCatPost.streetCatImages.map((image) => ({
    imageId: image.images.imageId,
    url: image.images.url
  }))

  return {
    ...streetCatPost,
    streetCatImages: steetCatImages
  }
}

export const readLocation = async (tx: Prisma.TransactionClient, locationId: number) => {
  return await tx.locations.findUnique({
    where: {
      locationId
    },
    select: {
      longitude: true,
      latitude: true,
      detail: true
    }
  })
}

export const createPost = async (tx: Prisma.TransactionClient, {
  categoryId,
  name,
  gender,
  neutered,
  discoveryDate,
  locationId,
  content,
  uuid,
}: Omit<IStreetCatPost, "postId">) => {

  return await tx.streetCats.create({
    data: {
      categoryId,
      name,
      gender,
      neutered,
      discoveryDate: new Date(discoveryDate),
      locationId,
      content,
      uuid,
    },
  });
}

export const updatePost = async (tx: Prisma.TransactionClient, {
  postId,
  categoryId,
  name,
  gender,
  neutered,
  discoveryDate,
  locationId,
  content,
  uuid,
}: IStreetCatPost) => {
  return await prisma.streetCats.update({
    where: {
      postId,
      uuid
    },
    data: {
      categoryId,
      name,
      gender,
      neutered,
      discoveryDate: new Date(discoveryDate),
      locationId,
      content,
    },
  });
}

export const deletePost = async (tx: Prisma.TransactionClient, postId: number, uuid: Buffer) => {
  return await tx.streetCats.delete({
    where: {
      postId,
      uuid
    }
  });
}

export const readStreetCatImages = async (postId: number) => {
  return await prisma.streetCatImages.findMany({
    where: {
      postId: postId,
    }
  });
}

export const createStreetCatImages = async (tx: Prisma.TransactionClient, streetCatImages: IStreetCatImages[]) => {
  await tx.streetCatImages.createMany({
    data: streetCatImages,
  });
}

export const deleteAllStreetCatImages = async (tx: Prisma.TransactionClient, postId: number) => {
  await tx.streetCatImages.deleteMany({
    where: {
      postId: postId,
    }
  });
}

export const deleteStreetCatImages = async (tx: Prisma.TransactionClient, imageIds: number[]) => {
  await tx.streetCatImages.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
}

export const addImage = async (tx: Prisma.TransactionClient, url: string) => {
  return await tx.images.create({
    data: {
      url,
    },
  });
};

export const deleteThumbnail = async (tx: Prisma.TransactionClient, postId: number) => {
  return await tx.streetCats.update({
    where: {
      postId
    },
    data: {
      thumbnail: null
    }
  })
}

export const deleteImages = async (
  tx: Prisma.TransactionClient,
  imageIds: number[]
) => {
  return await tx.images.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
};

export const readFavoriteCatPosts = async (tx: Prisma.TransactionClient, uuid: Buffer, limit: number, cursor?: number) => {
  const favoriteCatPosts = await prisma.streetCats.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { postId: cursor} }),
    where: {
      uuid,
    },
    select: {
      postId: true,
      thumbnail: true,
      name: true,
      createdAt: true
    }
  })

  return {
    favoriteCatPosts
  }
}

export const readFavoriteCatPostIds = async (tx: Prisma.TransactionClient, uuid: Buffer) => {
  return await prisma.streetCatFavorites.findMany({
    where: {
      uuid,
    },
    select: {
      postId: true
    }
  })
}


export const readFavoriteCat = async (uuid: Buffer, postId: number) => {
  return await prisma.streetCatFavorites.findMany({
    where: {
      uuid,
      postId
    },
    select: {
      postId: true
    }
  })
}

export const createFavoriteCat = async (uuid: Buffer, postId: number) => {
  return await prisma.streetCatFavorites.create({
    data: {
      uuid,
      postId
    }
  })
}

export const removeFavoriteCat = async (uuid: Buffer, postId: number) => {
  return await prisma.streetCatFavorites.deleteMany({
    where: {
      uuid,
      postId
    }
  })
}

export const removeAllFavoriteCat = async (postId: number) => {
  return await prisma.streetCatFavorites.deleteMany({
    where: {
      postId
    }
  })
}

export const readComments = async (tx: Prisma.TransactionClient, streetCatId: number, limit: number, cursor?: number) => {
  const streetCatComments = await prisma.streetCatComments.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { streetCatCommentId: cursor } }),
    where: {
      streetCatId,
    },
    orderBy: {
      createdAt: "asc"
    },
    select: {
      streetCatCommentId: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      users: {
        select: {
          id: true,
          uuid: true,
          nickname: true,
          profileImage: true,
        }
      },
    }
  })

  return {
    streetCatComments
  }
}

export const addComment = async (uuid: Buffer, postId: number, comment: string) => {
  return await prisma.streetCatComments.create({
    data: {
      streetCatId: postId,
      uuid,
      comment
    }
  })
}

export const putComment = async (uuid: Buffer, streetCatCommentId: number, streetCatId: number, comment: string) => {
  return await prisma.streetCatComments.update({
    where: {
      streetCatCommentId,
      streetCatId,
      uuid
    },
    data: {
      comment
    }
  })
}

export const removeComment = async (uuid: Buffer, streetCatCommentId: number, streetCatId: number) => {
  return await prisma.streetCatComments.delete({
    where: {
      streetCatCommentId,
      streetCatId,
      uuid
    }
  })
}

export const removeAllComment = async (streetCatId: number) => {
  return await prisma.streetCatComments.deleteMany({
    where: {
      streetCatId,
    }
  })
}