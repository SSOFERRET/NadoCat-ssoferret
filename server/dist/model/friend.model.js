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
exports.removeFriend = exports.addFriend = exports.getFriendList = exports.getFriendById = exports.getFriends = exports.getFriendCounts = void 0;
const client_1 = __importDefault(require("../client"));
const getFriendCounts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.friends.count({
        where: {
            uuid: userId,
        },
    });
});
exports.getFriendCounts = getFriendCounts;
const getFriends = (userId, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const friends = yield client_1.default.friends.findMany({
        where: {
            uuid: userId,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { friendId: cursor } : undefined,
        select: {
            friendId: true,
            followingId: true,
            usersFriendsFollowingIdTousers: {
                select: {
                    id: true,
                    uuid: true,
                    email: true,
                    nickname: true,
                    profileImage: true,
                },
            },
        },
    });
    return friends.map((friend) => {
        return {
            id: friend.friendId,
            userId: friend.followingId.toString("hex"),
            email: friend.usersFriendsFollowingIdTousers.email,
            nickname: friend.usersFriendsFollowingIdTousers.nickname,
            profileImage: friend.usersFriendsFollowingIdTousers.profileImage,
        };
    });
});
exports.getFriends = getFriends;
const getFriendById = (userId, followingId, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : client_1.default;
    return yield client.friends.findFirst({
        where: {
            uuid: userId,
            followingId: followingId,
        },
    });
});
exports.getFriendById = getFriendById;
const getFriendList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.friends.findMany({
        where: {
            uuid: userId,
        },
    });
});
exports.getFriendList = getFriendList;
const addFriend = (tx, userId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.friends.create({
        data: {
            followingId: followingId,
            uuid: userId,
        },
    });
});
exports.addFriend = addFriend;
const removeFriend = (tx, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.friends.delete({
        where: {
            friendId,
        },
    });
});
exports.removeFriend = removeFriend;
