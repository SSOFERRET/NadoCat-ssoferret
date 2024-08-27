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
exports.removeLikesById = exports.getLikeIds = exports.removeImagesByIds = exports.removeTagsByIds = exports.addEventImages = exports.addEventTags = exports.removeEventById = exports.updateEventById = exports.addEvent = exports.getEventById = exports.getEventList = exports.getEventsCount = void 0;
const client_1 = __importDefault(require("../client"));
const category_1 = require("../constants/category");
const orderBy_1 = require("../util/sort/orderBy");
const selectEvents = {
    users: {
        select: {
            id: true,
            uuid: true,
            nickname: true,
            profileImage: true,
        },
    },
    eventImages: {
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
    eventTags: {
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
            eventLikes: true,
        },
    },
};
const selectEvent = {
    postId: true,
    categoryId: true,
    title: true,
    content: true,
    views: true,
    createdAt: true,
    updatedAt: true,
    isClosed: true,
    users: {
        select: {
            id: true,
            uuid: true,
            nickname: true,
            profileImage: true,
        },
    },
    eventImages: {
        select: {
            images: {
                select: {
                    imageId: true,
                    url: true,
                },
            },
        },
    },
    eventTags: {
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
            eventLikes: true,
        },
    },
};
const getEventsCount = () => __awaiter(void 0, void 0, void 0, function* () { return yield client_1.default.events.count(); });
exports.getEventsCount = getEventsCount;
const getEventList = (limit, sort, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.EVENTS;
    const orderBy = (0, orderBy_1.getOrderBy)(sort);
    const orderOptions = [];
    if (orderBy.sortBy === "likes") {
        orderOptions.push({
            eventLikes: {
                _count: orderBy.sortOrder,
            },
        });
    }
    else {
        orderOptions.push({
            [orderBy.sortBy]: orderBy.sortOrder,
        });
    }
    const events = yield client_1.default.events.findMany({
        where: {
            categoryId,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { postId: cursor } : undefined,
        orderBy: orderOptions,
        include: selectEvents,
    });
    return events.map((event) => {
        var _a;
        return {
            postId: event.postId,
            categoryId: event.categoryId,
            title: event.title,
            content: event.content,
            views: event.views,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            isClosed: event.isClosed,
            users: {
                id: event === null || event === void 0 ? void 0 : event.users.id,
                uuid: (event === null || event === void 0 ? void 0 : event.users.uuid).toString("hex"),
                nickname: event === null || event === void 0 ? void 0 : event.users.nickname,
                profileImage: event === null || event === void 0 ? void 0 : event.users.profileImage,
            },
            tags: event.eventTags.map((item) => item.tags),
            thumbnail: (_a = event.eventImages.map((item) => item.images.url).join("")) !== null && _a !== void 0 ? _a : null,
            likes: event._count.eventLikes,
        };
    });
});
exports.getEventList = getEventList;
const getEventById = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.EVENTS;
    const event = yield client_1.default.events.findUnique({
        where: {
            postId,
            categoryId,
        },
        select: selectEvent,
    });
    if (!event) {
        return null;
    }
    return {
        postId: event.postId,
        categoryId: event.categoryId,
        title: event.title,
        content: event.content,
        views: event.views,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        isClosed: event.isClosed,
        users: {
            id: event === null || event === void 0 ? void 0 : event.users.id,
            uuid: (event === null || event === void 0 ? void 0 : event.users.uuid).toString("hex"),
            nickname: event === null || event === void 0 ? void 0 : event.users.nickname,
            profileImage: event === null || event === void 0 ? void 0 : event.users.profileImage,
        },
        tags: event === null || event === void 0 ? void 0 : event.eventTags.map((item) => item.tags),
        images: event === null || event === void 0 ? void 0 : event.eventImages.map((item) => item.images),
        likes: event._count.eventLikes,
    };
});
exports.getEventById = getEventById;
const addEvent = (tx, userId, title, content, isClosed) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.EVENTS;
    return yield tx.events.create({
        data: {
            title,
            content,
            isClosed,
            categoryId,
            uuid: userId,
        },
    });
});
exports.addEvent = addEvent;
const updateEventById = (tx, userId, postId, title, content, isClosed) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.EVENTS;
    return yield tx.events.update({
        where: {
            postId,
            uuid: userId,
            categoryId,
        },
        data: {
            title,
            content,
            isClosed,
        },
    });
});
exports.updateEventById = updateEventById;
const removeEventById = (tx, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = category_1.CATEGORY.EVENTS;
    return yield tx.events.delete({
        where: {
            postId,
            uuid: userId,
            categoryId,
        },
    });
});
exports.removeEventById = removeEventById;
const addEventTags = (tx, tags) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventTags.createMany({
        data: tags,
    });
});
exports.addEventTags = addEventTags;
const addEventImages = (tx, images) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventImages.createMany({
        data: images,
    });
});
exports.addEventImages = addEventImages;
const removeTagsByIds = (tx, tagIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventTags.deleteMany({
        where: {
            tagId: {
                in: tagIds,
            },
        },
    });
});
exports.removeTagsByIds = removeTagsByIds;
const removeImagesByIds = (tx, imageIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventImages.deleteMany({
        where: {
            imageId: {
                in: imageIds,
            },
        },
    });
});
exports.removeImagesByIds = removeImagesByIds;
const getLikeIds = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventLikes.findMany({
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
    return yield tx.eventLikes.deleteMany({
        where: {
            postId,
        },
    });
});
exports.removeLikesById = removeLikesById;
