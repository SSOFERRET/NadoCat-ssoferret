"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreetCatForOpenSearchData = exports.readStreetCatMap = exports.removeAllComment = exports.removeComment = exports.putComment = exports.addComment = exports.readComments = exports.removeAllFavoriteCat = exports.removeFavoriteCat = exports.createFavoriteCat = exports.readFavoriteCat = exports.readFavoriteCatPostIds = exports.readFavoriteCatPosts = exports.deleteImages = exports.deleteThumbnail = exports.addImage = exports.deleteStreetCatImages = exports.deleteAllStreetCatImages = exports.createStreetCatImages = exports.readStreetCatImages = exports.deletePost = exports.updatePost = exports.createPost = exports.readLocation = exports.createLoction = exports.getStreetCatById = exports.readPost = exports.readPostsWithFavorites = exports.readPosts = void 0;
const client_1 = __importDefault(require("../client"));
// NOTE: 함수명 통일성 필요 (ex. delete | remove 중에 통일)
const readPosts = (tx, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const streetCatPosts = yield client_1.default.streetCats.findMany(Object.assign(Object.assign({ take: limit, skip: cursor ? 1 : 0 }, (cursor && { cursor: { postId: cursor } })), { orderBy: {
            createdAt: "desc"
        }, include: {
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
        } }));
    return {
        streetCatPosts
    };
});
exports.readPosts = readPosts;
const readPostsWithFavorites = (tx, uuid, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const streetCatPosts = yield client_1.default.streetCats.findMany(Object.assign(Object.assign({ take: limit, skip: cursor ? 1 : 0 }, (cursor && { cursor: { postId: cursor } })), { orderBy: {
            createdAt: "desc"
        }, include: {
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
        } }));
    return {
        streetCatPosts
    };
});
exports.readPostsWithFavorites = readPostsWithFavorites;
const readPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const streetCatPost = yield client_1.default.streetCats.findUnique({
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
    });
    if (!streetCatPost) {
        return null;
    }
    ;
    const streetCatPostUuid = streetCatPost.uuid.toString('hex');
    const userUuid = streetCatPost.users.uuid.toString('hex');
    const steetCatImages = streetCatPost.streetCatImages.map((image) => ({
        imageId: image.images.imageId,
        url: image.images.url
    }));
    return Object.assign(Object.assign({}, streetCatPost), { uuid: streetCatPostUuid, users: Object.assign(Object.assign({}, streetCatPost.users), { uuid: userUuid }), streetCatImages: steetCatImages });
});
exports.readPost = readPost;
const getStreetCatById = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.streetCats.findUnique({
        where: {
            postId: postId,
        },
    });
});
exports.getStreetCatById = getStreetCatById;
const createLoction = (tx, location) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.locations.create({
        data: {
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            detail: location.location.detail
        }
    });
});
exports.createLoction = createLoction;
const readLocation = (tx, locationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.locations.findUnique({
        where: {
            locationId
        },
        select: {
            longitude: true,
            latitude: true,
            detail: true
        }
    });
});
exports.readLocation = readLocation;
const createPost = (tx_1, _a, locationId_1) => __awaiter(void 0, [tx_1, _a, locationId_1], void 0, function* (tx, { categoryId, name, gender, neutered, discoveryDate, content, uuid, }, locationId) {
    return yield tx.streetCats.create({
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
});
exports.createPost = createPost;
const updatePost = (tx_1, _a) => __awaiter(void 0, [tx_1, _a], void 0, function* (tx, { postId, categoryId, name, gender, neutered, discoveryDate, locationId, content, uuid, }) {
    return yield client_1.default.streetCats.update({
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
});
exports.updatePost = updatePost;
const deletePost = (tx, postId, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.streetCats.delete({
        where: {
            postId,
            uuid
        }
    });
});
exports.deletePost = deletePost;
const readStreetCatImages = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatImages.findMany({
        where: {
            postId: postId,
        }
    });
});
exports.readStreetCatImages = readStreetCatImages;
const createStreetCatImages = (tx, streetCatImages) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.streetCatImages.createMany({
        data: streetCatImages,
    });
});
exports.createStreetCatImages = createStreetCatImages;
const deleteAllStreetCatImages = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.streetCatImages.deleteMany({
        where: {
            postId: postId,
        }
    });
});
exports.deleteAllStreetCatImages = deleteAllStreetCatImages;
const deleteStreetCatImages = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.streetCatImages.deleteMany({
        where: {
            imageId: {
                in: imageIds,
            },
        },
    });
});
exports.deleteStreetCatImages = deleteStreetCatImages;
const addImage = (tx, url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.images.create({
        data: {
            url,
        },
    });
});
exports.addImage = addImage;
const deleteThumbnail = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.streetCats.update({
        where: {
            postId
        },
        data: {
            thumbnail: null
        }
    });
});
exports.deleteThumbnail = deleteThumbnail;
const deleteImages = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.images.deleteMany({
        where: {
            imageId: {
                in: imageIds,
            },
        },
    });
});
exports.deleteImages = deleteImages;
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
const readFavoriteCatPosts = (tx, uuid, limit, cursor, postIds) => __awaiter(void 0, void 0, void 0, function* () {
    const favoriteCatPosts = yield client_1.default.streetCats.findMany(Object.assign(Object.assign({ take: limit, skip: cursor ? 1 : 0 }, (cursor && { cursor: { postId: cursor } })), { orderBy: {
            createdAt: "desc"
        }, where: {
            postId: {
                in: postIds,
            },
        }, include: {
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
        } }));
    const favoriteCatPostCount = yield client_1.default.streetCats.count({
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
    const nickname = yield client_1.default.users.findUnique({
        where: {
            uuid
        }
    });
    return {
        favoriteCatPosts,
        favoriteCatPostCount,
        nickname
    };
});
exports.readFavoriteCatPosts = readFavoriteCatPosts;
const readFavoriteCatPostIds = (tx, uuid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatFavorites.findMany({
        where: {
            uuid,
        },
        select: {
            postId: true
        }
    });
});
exports.readFavoriteCatPostIds = readFavoriteCatPostIds;
const readFavoriteCat = (uuid, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatFavorites.findMany({
        where: {
            uuid,
            postId
        },
        select: {
            postId: true
        }
    });
});
exports.readFavoriteCat = readFavoriteCat;
const createFavoriteCat = (uuid, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatFavorites.create({
        data: {
            uuid,
            postId
        }
    });
});
exports.createFavoriteCat = createFavoriteCat;
const removeFavoriteCat = (uuid, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatFavorites.deleteMany({
        where: {
            uuid,
            postId
        }
    });
});
exports.removeFavoriteCat = removeFavoriteCat;
const removeAllFavoriteCat = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatFavorites.deleteMany({
        where: {
            postId
        }
    });
});
exports.removeAllFavoriteCat = removeAllFavoriteCat;
const readComments = (tx, streetCatId, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const streetCatComments = yield client_1.default.streetCatComments.findMany(Object.assign(Object.assign({ take: limit, skip: cursor ? 1 : 0 }, (cursor && { cursor: { streetCatCommentId: cursor } })), { where: { streetCatId }, orderBy: { createdAt: "asc" }, select: {
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
        } }));
    const commentsCount = yield client_1.default.streetCatComments.count({
        where: { streetCatId },
    });
    const transformedComments = streetCatComments.map(comment => ({
        commentId: comment.streetCatCommentId,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        users: Object.assign(Object.assign({}, comment.users), { uuid: comment.users.uuid.toString('hex') }),
    }));
    return {
        streetCatComments: transformedComments,
        commentsCount
    };
});
exports.readComments = readComments;
const addComment = (uuid, postId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatComments.create({
        data: {
            streetCatId: postId,
            uuid,
            comment
        }
    });
});
exports.addComment = addComment;
const putComment = (uuid, streetCatCommentId, streetCatId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatComments.update({
        where: {
            streetCatCommentId,
            streetCatId,
            uuid
        },
        data: {
            comment
        }
    });
});
exports.putComment = putComment;
const removeComment = (uuid, streetCatCommentId, streetCatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatComments.delete({
        where: {
            streetCatCommentId,
            streetCatId,
            uuid
        }
    });
});
exports.removeComment = removeComment;
const removeAllComment = (streetCatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.streetCatComments.deleteMany({
        where: {
            streetCatId,
        }
    });
});
exports.removeAllComment = removeAllComment;
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
const readStreetCatMap = (lat, lng, latRange, lngRange) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield client_1.default.locations.findMany({
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
        const streetCatMap = locations.map(location => (Object.assign(Object.assign({}, location), { streetCats: location.streetCats.map(cat => (Object.assign(Object.assign({}, cat), { streetCatImages: cat.streetCatImages.map(catImage => (Object.assign(Object.assign({}, catImage), { images: catImage.images.url || null }))) }))) })));
        return streetCatMap;
    }
    catch (error) {
        console.error("Error in readStreetCatMap:", error);
        throw new Error("Failed to fetch street cat map");
    }
});
exports.readStreetCatMap = readStreetCatMap;
const getStreetCatForOpenSearchData = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const getPost = yield (0, exports.readPost)(postId);
            const name = getPost === null || getPost === void 0 ? void 0 : getPost.name;
            const content = getPost === null || getPost === void 0 ? void 0 : getPost.content;
            const users = getPost === null || getPost === void 0 ? void 0 : getPost.users;
            const createdAt = getPost === null || getPost === void 0 ? void 0 : getPost.createdAt;
            const image = getPost === null || getPost === void 0 ? void 0 : getPost.streetCatImages[0].url;
            const locationId = Number(getPost === null || getPost === void 0 ? void 0 : getPost.locationId);
            const getLocation = yield (0, exports.readLocation)(tx, locationId);
            const postData = { name, content, users, image, createdAt, location: getLocation };
            return postData;
        }));
    }
    catch (error) {
        console.error(error);
    }
});
exports.getStreetCatForOpenSearchData = getStreetCatForOpenSearchData;
