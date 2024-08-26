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
exports.getLatestNotificationByReceiver = exports.getNotificationsCount = exports.getNotificationListByReceiver = exports.getMissingFavoriteAdders = exports.getMissingReporters = exports.updateNotificationsIsReadByReceiver = exports.createNotification = void 0;
const client_1 = __importDefault(require("../client"));
const createNotification = (notifications) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.notifications.createMany({
        data: notifications
    });
});
exports.createNotification = createNotification;
const updateNotificationsIsReadByReceiver = (receiver) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.notifications.updateMany({
        where: {
            receiver
        },
        data: {
            isRead: true
        }
    });
});
exports.updateNotificationsIsReadByReceiver = updateNotificationsIsReadByReceiver;
// export const getNotificationListByReceiver = async (
//   receiver: Buffer
// ) => {
//   return await prisma.notifications.findMany({
//     where: {
//       receiver
//     }
//   })
// }
const getMissingReporters = (tx, missingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingReports.findMany({
        where: {
            missingId
        }
    });
});
exports.getMissingReporters = getMissingReporters;
const getMissingFavoriteAdders = (tx, postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.missingFavorites.findMany({
        where: {
            postId
        }
    });
});
exports.getMissingFavoriteAdders = getMissingFavoriteAdders;
const getNotificationListByReceiver = (receiver, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.notifications.findMany({
        where: {
            receiver,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { notificationId: cursor } : undefined,
        orderBy: [
            {
                notificationId: "desc",
            },
        ],
        select: {
            notificationId: true,
            receiver: false,
            sender: false,
            usersNotificationsSenderTousers: {
                select: {
                    nickname: true,
                    profileImage: true,
                    uuid: true,
                    id: true,
                },
            },
            type: true,
            url: true,
            isRead: true,
            timestamp: true
        },
    });
});
exports.getNotificationListByReceiver = getNotificationListByReceiver;
const getNotificationsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.notifications.count();
});
exports.getNotificationsCount = getNotificationsCount;
const getLatestNotificationByReceiver = (receiver) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.notifications.findFirst({
        where: {
            receiver,
        },
        orderBy: {
            timestamp: 'desc',
        },
    });
});
exports.getLatestNotificationByReceiver = getLatestNotificationByReceiver;
