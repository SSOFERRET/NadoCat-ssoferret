import { Prisma } from "@prisma/client";
import prisma from "../client"
import { IImages, ILocation, IStreetCatImages, IStreetCatPost, IStreetCats } from "../types/streetCat"

// NOTE: 함수명 통일성 필요 (ex. delete | remove 중에 통일)
export const readPosts = async (tx: Prisma.TransactionClient, limit: number, cursor?: number) => {
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
      uuid: true,
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

  const streetCatPostUuid = streetCatPost.uuid.toString('hex');
  const userUuid = streetCatPost.users.uuid.toString('hex');
  const steetCatImages = streetCatPost.streetCatImages.map((image) => ({
    imageId: image.images.imageId,
    url: image.images.url
  }))

  return {
    ...streetCatPost,
    uuid: streetCatPostUuid,
    users: {
      ...streetCatPost.users,
      uuid: userUuid,
    },
    streetCatImages: steetCatImages,
  };
}

export const getStreetCatById = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.streetCats.findUnique({
    where: {
      postId: postId,
    },
  });
};

export const createLoction = async (tx: Prisma.TransactionClient, location: ILocation) => {

  return await tx.locations.create({
    data: {
      latitude: location.location.latitude,
      longitude: location.location.longitude,
      detail: location.location.detail
    }
  })
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
  content,
  uuid,
}: Omit<IStreetCatPost, "postId" | "locationId">, locationId: number) => {

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

// export const readFavoriteCatPosts = async (
//   tx: Prisma.TransactionClient,
//   uuid: Buffer,
//   limit: number,
//   cursor?: number,
//   postIds?: number[]
// ) => {
//   const favoriteCatPosts = await tx.$queryRaw<Prisma.streetCats[]>`
//     SELECT sc.*
//     FROM StreetCats sc
//     INNER JOIN (
//       SELECT postId, MAX(createdAt) as maxCreatedAt
//       FROM StreetCatFavorites
//       GROUP BY postId
//     ) scf ON sc.postId = scf.postId
//     WHERE sc.postId IN (${Prisma.join(postIds)})
//     ORDER BY scf.maxCreatedAt DESC
//     LIMIT ${limit}
//     OFFSET ${cursor ? cursor : 0}
//   `;

//   return favoriteCatPosts;
// };

export const readFavoriteCatPosts = async (tx: Prisma.TransactionClient, uuid: Buffer, limit: number, cursor?: number, postIds?: number[]) => {
  const favoriteCatPosts = await prisma.streetCats.findMany({
    take: limit,
    skip: cursor ? 1 : 0,

    ...(cursor && { cursor: { postId: cursor} }),
    orderBy: {
      createdAt: "desc"
    },
    where: {
      postId: {
        in: postIds,
      },
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
      },
    }
  })

  const favoriteCatPostCount = await prisma.streetCats.count({
    where: {
      postId: {
        in: postIds,
      },
      streetCatFavorites: {
        some: {
          uuid,
        },
      },
    },
  });

  const nickname = await prisma.users.findUnique({
    where: {
      uuid
    }
  })

  return {
    favoriteCatPosts,
    favoriteCatPostCount,
    nickname
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

export const readComments = async (
  tx: Prisma.TransactionClient,
  streetCatId: number,
  limit: number,
  cursor?: number
) => {
  const streetCatComments = await prisma.streetCatComments.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { streetCatCommentId: cursor } }),
    where: { streetCatId },
    orderBy: { createdAt: "asc" },
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
  });

  const transformedComments = streetCatComments.map(comment => ({
    commentId: comment.streetCatCommentId,
    comment: comment.comment,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    users: {
      ...comment.users,
      uuid: comment.users.uuid.toString('hex'),
    },
  }));

  return {
    streetCatComments: transformedComments,
  };
};


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

// export const readStreetCatMap = async () => {
//   try {
//     const locations = await prisma.locations.findMany({
//       select: {
//         locationId: true,
//         latitude: true,
//         longitude: true,
//         detail: true,
//         streetCats: {
//           select: {
//             postId: true,
//             name: true,
//             discoveryDate: true,
//             streetCatImages: {
//               select: {
//                 imageId: true,
//                 images: {
//                   select: {
//                     url: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     const streetCatMap = locations.map(location => ({
//       ...location,
//       streetCats: location.streetCats.map(cat => ({
//         ...cat,
//         streetCatImages: cat.streetCatImages.map(catImage => ({
//           ...catImage,
//           images: catImage.images.url || null,
//         })),
//       })),
//     }));

//     return streetCatMap;
//   } catch (error) {
//     console.error("Error in readStreetCatMap:", error);
//     throw new Error("Failed to fetch street cat map");
//   }
// };

export const readStreetCatMap = async (lat: number, lng: number, latRange: number, lngRange: number) => {
  try {
    const locations = await prisma.locations.findMany({
      where: {
        latitude: {
          gte: lat - latRange,
          lte: lat + latRange,
        },
        longitude: {
          gte: lng - lngRange,
          lte: lng + lngRange,
        },
      },
      select: {
        locationId: true,
        latitude: true,
        longitude: true,
        detail: true,
        streetCats: {
          select: {
            postId: true,
            name: true,
            discoveryDate: true,
            streetCatImages: {
              select: {
                imageId: true,
                images: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const streetCatMap = locations.map(location => ({
      ...location,
      streetCats: location.streetCats.map(cat => ({
        ...cat,
        streetCatImages: cat.streetCatImages.map(catImage => ({
          ...catImage,
          images: catImage.images.url || null,
        })),
      })),
    }));

    return streetCatMap;
  } catch (error) {
    console.error("Error in readStreetCatMap:", error);
    throw new Error("Failed to fetch street cat map");
  }
};
