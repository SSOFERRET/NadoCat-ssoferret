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
exports.deleteCommentsById = exports.deleteCommentById = exports.updateCommentById = exports.addComment = exports.getCommunityComments = exports.getCommentCount = void 0;
const client_1 = __importDefault(require("../client"));
const getCommentCount = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.communityComments.count({
        where: {
            communityId: postId,
        },
    });
});
exports.getCommentCount = getCommentCount;
const getCommunityComments = (postId, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.communityComments.findMany({
        where: {
            communityId: postId,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { communityCommentId: cursor } : undefined,
        orderBy: [
            {
                createdAt: "desc",
            },
        ],
        select: {
            communityCommentId: true,
            comment: true,
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
        },
    });
    return result.map((item) => {
        return {
            commentId: item.communityCommentId,
            comment: item.comment,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            users: {
                id: item.users.id,
                uuid: item.users.uuid.toString("hex"),
                nickname: item.users.nickname,
                profileImage: item.users.profileImage,
            },
        };
    });
});
exports.getCommunityComments = getCommunityComments;
const addComment = (postId, userId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.communityComments.create({
        data: {
            uuid: userId,
            communityId: postId,
            comment,
        },
    });
});
exports.addComment = addComment;
const updateCommentById = (postId, userId, commentId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.communityComments.update({
        where: {
            communityId: postId,
            communityCommentId: commentId,
            uuid: userId,
        },
        data: {
            comment,
        },
    });
});
exports.updateCommentById = updateCommentById;
const deleteCommentById = (postId, userId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.communityComments.delete({
        where: {
            communityId: postId,
            communityCommentId: commentId,
            uuid: userId,
        },
    });
});
exports.deleteCommentById = deleteCommentById;
const deleteCommentsById = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.communityComments.deleteMany({
        where: {
            communityId: postId,
        },
    });
});
exports.deleteCommentsById = deleteCommentsById;
