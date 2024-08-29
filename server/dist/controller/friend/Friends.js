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
exports.unfollow = exports.follow = exports.getFollowing = exports.followings = void 0;
const client_1 = __importDefault(require("../../client"));
const http_status_codes_1 = require("http-status-codes");
const friend_model_1 = require("../../model/friend.model");
const errors_1 = require("../../util/errors/errors");
const Notifications_1 = require("../notification/Notifications");
const followings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const limit = Number(req.query.limit) || 5;
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const count = yield (0, friend_model_1.getFriendCounts)(userId);
        const friends = yield (0, friend_model_1.getFriends)(userId, limit, cursor);
        const nextCursor = friends.length === limit ? friends[friends.length - 1].id : null;
        res.status(http_status_codes_1.StatusCodes.OK).json({
            follows: friends,
            pagination: {
                nextCursor,
                totalCount: count,
            },
        });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.followings = followings;
const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const followingId = Buffer.from(req.params.following_id, "hex");
        const friend = yield (0, friend_model_1.getFriendById)(userId, followingId);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(friend);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.getFollowing = getFollowing;
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const followingId = Buffer.from(req.params.following_id, "hex");
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, friend_model_1.addFriend)(tx, userId, followingId);
            (0, Notifications_1.notify)({
                type: "follow",
                receiver: req.params.following_id,
                sender: uuid,
                url: `/users/user/${req.params.following_id}`,
            });
        }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "친구 추가가 완료되었습니다." });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.follow = follow;
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const followingId = Buffer.from(req.params.following_id, "hex");
        yield client_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const friend = yield (0, friend_model_1.getFriendById)(userId, followingId, tx);
            if (!friend) {
                throw new Error("요청한 친구 정보를 찾을 수 없습니다.");
            }
            yield (0, friend_model_1.removeFriend)(tx, friend.friendId);
        }));
        res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.unfollow = unfollow;
