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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventLike = exports.deleteCommunityLike = exports.addEventLike = exports.addCommunityLike = exports.findLike = exports.removeLike = exports.saveLike = exports.removeLikesByIds = exports.getLiked = void 0;
const getLiked = (tx, postId, categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.likes.findFirst({
        where: {
            postId,
            categoryId,
            uuid: userId,
        },
    });
});
exports.getLiked = getLiked;
const removeLikesByIds = (tx, likeIds) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.likes.deleteMany({
        where: {
            likeId: {
                in: likeIds.map((like) => like.likeId),
            },
        },
    });
});
exports.removeLikesByIds = removeLikesByIds;
const saveLike = (tx, postId, categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.likes.create({
        data: {
            postId,
            categoryId,
            uuid: userId,
        },
    });
});
exports.saveLike = saveLike;
const removeLike = (tx, likeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.likes.delete({
        where: {
            likeId,
        },
    });
});
exports.removeLike = removeLike;
const findLike = (tx, postId, categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.likes.findFirst({
        where: {
            postId,
            categoryId,
            uuid: userId,
        },
    });
});
exports.findLike = findLike;
const addCommunityLike = (tx, postId, likeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityLikes.create({
        data: {
            likeId,
            postId,
        },
    });
});
exports.addCommunityLike = addCommunityLike;
const addEventLike = (tx, postId, likeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventLikes.create({
        data: {
            likeId,
            postId,
        },
    });
});
exports.addEventLike = addEventLike;
const deleteCommunityLike = (tx, postId, likeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityLikes.delete({
        where: {
            likeId,
            postId,
        },
    });
});
exports.deleteCommunityLike = deleteCommunityLike;
const deleteEventLike = (tx, postId, likeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.eventLikes.delete({
        where: {
            likeId,
            postId,
        },
    });
});
exports.deleteEventLike = deleteEventLike;
