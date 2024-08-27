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
exports.removeLikesById = exports.getLikeIds = exports.removeImagesByIds = exports.removeTagsByIds = exports.addCommunityImages = exports.addCommunityTags = exports.removeCommunityById = exports.updateCommunityById = exports.addCommunity = exports.getCommunityById = exports.getCommunityList = exports.getCommunitiesCount = void 0;
const client_1 = __importDefault(require("../client"));
const category_1 = require("../constants/category");
const orderBy_1 = require("../util/sort/orderBy");
const selecteCommunity = {
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
    _count: {
        select: {
            communityLikes: true,
        },
    },
};
const selectCommunities = {
    users: {
        select: {
            id: true,
            uuid: true,
            nickname: true,
            profileImage: true,
        },
    },
    communityImages: {
        take: 1,
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
    _count: {
        select: {
            communityLikes: true,
        },
    },
};
const getCommunitiesCount = () => __awaiter(void 0, void 0, void 0, function* () { return yield client_1.default.communities.count(); });
exports.getCommunitiesCount = getCommunitiesCount;
const getCommunityList = (limit, sort, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.COMMUNITIES;
    const orderBy = (0, orderBy_1.getOrderBy)(sort);
    const orderOptions = [];
    if (orderBy.sortBy === "likes") {
        orderOptions.push({
            communityLikes: {
                _count: orderBy.sortOrder,
            },
        });
    }
    else {
        orderOptions.push({
            [orderBy.sortBy]: orderBy.sortOrder,
        });
    }
    const communities = yield client_1.default.communities.findMany({
        where: {
            categoryId,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { postId: cursor } : undefined,
        orderBy: orderOptions,
        include: selectCommunities,
    });
    return communities.map((community) => {
        var _a;
        return {
            postId: community.postId,
            categoryId: community.categoryId,
            title: community.title,
            content: community.content,
            views: community.views,
            createdAt: community.createdAt,
            updatedAt: community.updatedAt,
            users: {
                id: community === null || community === void 0 ? void 0 : community.users.id,
                uuid: (community === null || community === void 0 ? void 0 : community.users.uuid).toString("hex"),
                nickname: community === null || community === void 0 ? void 0 : community.users.nickname,
                profileImage: community === null || community === void 0 ? void 0 : community.users.profileImage,
            },
            tags: community.communityTags.map((item) => item.tags),
            thumbnail: (_a = community.communityImages.map((item) => item.images.url).join("")) !== null && _a !== void 0 ? _a : null,
            likes: community._count.communityLikes,
        };
    });
});
exports.getCommunityList = getCommunityList;
const getCommunityById = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.COMMUNITIES;
    const community = yield tx.communities.findUnique({
        where: {
            postId,
            categoryId,
        },
        select: selecteCommunity,
    });
    if (!community) {
        return null;
    }
    return {
        postId: community.postId,
        categoryId: community.categoryId,
        title: community.title,
        content: community.content,
        views: community.views,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
        users: {
            id: community === null || community === void 0 ? void 0 : community.users.id,
            uuid: (community === null || community === void 0 ? void 0 : community.users.uuid).toString("hex"),
            nickname: community === null || community === void 0 ? void 0 : community.users.nickname,
            profileImage: community === null || community === void 0 ? void 0 : community.users.profileImage,
        },
        tags: community === null || community === void 0 ? void 0 : community.communityTags.map((item) => item.tags),
        images: community === null || community === void 0 ? void 0 : community.communityImages.map((item) => item.images),
        likes: community._count.communityLikes,
    };
});
exports.getCommunityById = getCommunityById;
const addCommunity = (tx, userId, title, content) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.COMMUNITIES;
    return yield tx.communities.create({
        data: {
            uuid: userId,
            title,
            content,
            categoryId,
        },
    });
});
exports.addCommunity = addCommunity;
const updateCommunityById = (tx, postId, userId, title, content) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.COMMUNITIES;
    return yield tx.communities.update({
        where: {
            postId,
            uuid: userId,
            categoryId,
        },
        data: {
            title,
            content,
        },
    });
});
exports.updateCommunityById = updateCommunityById;
const removeCommunityById = (tx, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.COMMUNITIES;
    return yield tx.communities.delete({
        where: {
            postId,
            uuid: userId,
            categoryId,
        },
    });
});
exports.removeCommunityById = removeCommunityById;
const addCommunityTags = (tx, tags) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityTags.createMany({
        data: tags,
    });
});
exports.addCommunityTags = addCommunityTags;
const addCommunityImages = (tx, images) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityImages.createMany({
        data: images,
    });
});
exports.addCommunityImages = addCommunityImages;
const removeTagsByIds = (tx, tagIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityTags.deleteMany({
        where: {
            tagId: {
                in: tagIds,
            },
        },
    });
});
exports.removeTagsByIds = removeTagsByIds;
const removeImagesByIds = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityImages.deleteMany({
        where: {
            imageId: {
                in: imageIds,
            },
        },
    });
});
exports.removeImagesByIds = removeImagesByIds;
const getLikeIds = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityLikes.findMany({
        where: {
            postId,
        },
        select: {
            likeId: true,
        },
    });
});
exports.getLikeIds = getLikeIds;
const removeLikesById = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityLikes.deleteMany({
        where: {
            postId,
        },
    });
});
exports.removeLikesById = removeLikesById;
