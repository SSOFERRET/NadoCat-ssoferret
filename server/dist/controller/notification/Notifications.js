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
exports.getIsAllNotificationRead = exports.getNotificationList = exports.notifyNewLike = exports.notifyNewComment = exports.notifyNewPostToFriends = exports.updateNotifications = exports.notify = exports.serveNotifications = exports.notifications = void 0;
const notification_model_1 = require("../../model/notification.model");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../../util/errors/errors");
const friend_model_1 = require("../../model/friend.model");
const category_1 = require("../../constants/category");
const uuid_model_1 = require("../../model/common/uuid.model");
exports.notifications = [];
let lastNotification = null;
const serveNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });
        // const sendNotifications = async () => {
        //   if (notifications.length) {
        //     await createNotification(notifications);
        //     notifications.forEach((notification) => {
        //       if (notification && userId && userId === notification.receiver) {
        //         const notificationData = JSON.stringify({
        //           type: notification.type,
        //           sender: notification.sender,
        //           url: notification.url,
        //           timestamp: notification.timestamp
        //         })
        //         res.write(`data: ${notificationData}\n\n`);
        //       }
        //     });
        //     notifications.length = 0;
        //   } else {
        //     res.write('\n\n');
        //   }
        // };
        const sendNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
            if (exports.notifications.length) {
                yield (0, notification_model_1.createNotification)(exports.notifications);
                exports.notifications.forEach((notification) => {
                    if (notification && userId && userId === notification.receiver) {
                        const notificationData = JSON.stringify({
                            type: notification.type,
                            sender: notification.sender,
                            url: notification.url,
                            timestamp: notification.timestamp,
                        });
                        res.write(`data: ${notificationData}\n\n`);
                    }
                });
                exports.notifications.length = 0;
            }
            else {
                res.write("\n\n");
            }
        });
        const intervalid = setInterval(sendNotifications, 2000);
        req.on("close", () => clearInterval(intervalid));
    }
    catch (error) {
        console.error(error);
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.serveNotifications = serveNotifications;
const timestampObject = () => {
    const timestamp = new Date();
    return {
        timestamp: timestamp.toISOString(),
    };
};
const notify = (data) => {
    // 동일한 알림이 아닌지 확인하는 로직
    if (lastNotification &&
        lastNotification.type === data.type &&
        lastNotification.receiver === data.receiver &&
        lastNotification.sender === data.sender &&
        lastNotification.url === data.url &&
        lastNotification.commentId === data.commentId &&
        lastNotification.result === data.result) {
        return;
    }
    const timestamp = timestampObject();
    exports.notifications.push(Object.assign(Object.assign({}, data), timestamp));
    lastNotification = data;
};
exports.notify = notify;
const updateNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        (0, notification_model_1.updateNotificationsIsReadByReceiver)(userId);
        return res.status(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(error, res);
    }
});
exports.updateNotifications = updateNotifications;
const notifyNewPostToFriends = (userId, categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const friends = yield (0, friend_model_1.getFriendList)(userId);
    friends.forEach((friend) => (0, exports.notify)({
        type: "newPost",
        receiver: friend.followingId.toString("hex"),
        sender: userId.toString("hex"),
        url: `/boards/${(0, category_1.getCategoryUrlStringById)(categoryId)}/${postId}`,
    }));
});
exports.notifyNewPostToFriends = notifyNewPostToFriends;
const notifyNewComment = (userId, categoryId, postId, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const postAuthor = yield (0, uuid_model_1.getPostAuthorUuid)(categoryId, postId);
    (0, exports.notify)({
        type: "comment",
        receiver: postAuthor.toString("hex"),
        sender: userId.toString("hex"),
        url: `/boards/${(0, category_1.getCategoryUrlStringById)(categoryId)}/${postId}/comments?cursor=${cursor}`, //프론트 url에 맞출 것
    });
});
exports.notifyNewComment = notifyNewComment;
const notifyNewLike = (userId, categoryId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const postAuthor = yield (0, uuid_model_1.getPostAuthorUuid)(categoryId, postId);
    (0, exports.notify)({
        type: "like",
        receiver: postAuthor.toString("hex"),
        sender: userId.toString("hex"),
        url: `/boards/${(0, category_1.getCategoryUrlStringById)(categoryId)}/${postId}`, //프론트 url에 맞출 것
    });
});
exports.notifyNewLike = notifyNewLike;
const getNotificationList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const limit = 10;
        let notifications = yield (0, notification_model_1.getNotificationListByReceiver)(userId, limit);
        const count = yield (0, notification_model_1.getNotificationsCount)();
        const nextCursor = notifications.length === limit ? notifications[notifications.length - 1].notificationId : null;
        const result = {
            notifications,
            pagination: {
                nextCursor,
                totalCount: count,
            },
        };
        res.status(http_status_codes_1.StatusCodes.OK).send(result);
        yield (0, notification_model_1.updateNotificationsIsReadByReceiver)(userId);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
});
exports.getNotificationList = getNotificationList;
const getIsAllNotificationRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uuid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid;
    try {
        if (!uuid) {
            throw new Error("User UUID is missing.");
        }
        const userId = Buffer.from(uuid, "hex");
        const latest = yield (0, notification_model_1.getLatestNotificationByReceiver)(userId);
        const isAllRead = latest === null || latest === void 0 ? void 0 : latest.isRead;
        res.status(http_status_codes_1.StatusCodes.OK).json({ isAllRead });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getIsAllNotificationRead = getIsAllNotificationRead;
