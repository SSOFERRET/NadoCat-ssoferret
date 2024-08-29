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
exports.getInterestPosts = exports.getLikedPostIds = void 0;
const client_1 = __importDefault(require("../client"));
const getLikedPostIds = (userUuidBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const liked = yield client_1.default.likes.findMany({
        where: {
            uuid: userUuidBuffer,
        },
        select: {
            postId: true,
        },
    });
    return liked.map((like) => like.postId);
});
exports.getLikedPostIds = getLikedPostIds;
const getInterestPosts = (postIds) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.communities.findMany({
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
});
exports.getInterestPosts = getInterestPosts;
