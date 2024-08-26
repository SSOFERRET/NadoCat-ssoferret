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
exports.handleJoinRoom = exports.handleMessage = exports.deleteChat = exports.testUuid = exports.getChatList = exports.sendMessage = exports.startChat = void 0;
const client_1 = require("@prisma/client");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient();
let CHATID = "";
const startChat = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { userUuid, otherUserUuid } = req.body;
    try {
        if (!userUuid || !otherUserUuid) {
            return res.status(400).json({ error: "Invalid UUIDs provided" });
        }
        const userUuidBuffer = Buffer.from(userUuid, 'hex');
        const otherUserUuidBuffer = Buffer.from(otherUserUuid, 'hex');
        let chat = yield prisma.chats.findFirst({
            where: {
                OR: [
                    {
                        uuid: userUuidBuffer,
                        otherUuid: otherUserUuidBuffer,
                    },
                    {
                        uuid: otherUserUuidBuffer,
                        otherUuid: userUuidBuffer,
                    },
                ],
            },
            include: {
                messages: {
                    orderBy: {
                        sentAt: 'asc',
                    },
                },
            },
        });
        if (!chat) {
            chat = yield prisma.chats.create({
                data: {
                    uuid: userUuidBuffer,
                    otherUuid: otherUserUuidBuffer,
                },
                include: {
                    messages: true,
                },
            });
        }
        const chatRoomId = chat.chatId.toString();
        res.status(200).json({
            chatId: chatRoomId,
            messages: chat.messages,
        });
        io.to(chatRoomId).emit('chat_created', { chatId: chatRoomId });
        CHATID = chatRoomId;
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to start chat" });
    }
});
exports.startChat = startChat;
const sendMessage = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid, content, sentAt } = req.body;
    const chatId = parseInt(CHATID);
    try {
        const userUuidBuffer = Buffer.from(uuid, 'hex');
        const message = yield prisma.messages.create({
            data: {
                content,
                sentAt: sentAt,
                chats: {
                    connect: { chatId }
                },
                users: {
                    connect: { uuid: userUuidBuffer }
                }
            },
            include: {
                chats: true,
                users: true
            }
        });
        const formattedTime = (0, moment_timezone_1.default)(message.sentAt).tz(sentAt).format('YYYY-MM-DD HH:mm:ss');
        io.to(CHATID).emit('message', message, {
            user: uuid,
            message: message.content,
            time: formattedTime,
        });
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});
exports.sendMessage = sendMessage;
const getChatList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userUuid = req.headers["x-user-uuid"];
    try {
        const userUuidBuffer = Buffer.from(userUuid, 'hex');
        const chats = yield prisma.chats.findMany({
            where: {
                OR: [{
                        uuid: userUuidBuffer
                    }, {
                        otherUuid: userUuidBuffer
                    }],
            },
            include: {
                messages: {
                    orderBy: {
                        sentAt: 'asc'
                    },
                    include: {
                        users: true
                    }
                },
                users: true
            }
        });
        res.status(200).json(chats);
    }
    catch (error) {
        console.error("Error fetching chat list:", error);
        res.status(500).json({ error: "Failed to fetch chat list" });
    }
});
exports.getChatList = getChatList;
// userid 되는지 test
const testUuid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.body;
    const userUuidBuffer = Buffer.from(uuid, 'hex');
    try {
        const users = yield prisma.users.findFirst({
            where: {
                uuid: userUuidBuffer
            }
        });
        if (users) {
            res.status(200).json(users);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.testUuid = testUuid;
const deleteChat = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.body;
    try {
        yield prisma.$transaction([
            prisma.messages.deleteMany({
                where: { chatId: chatId },
            }),
            prisma.chats.delete({
                where: { chatId: chatId },
            }),
        ]);
        io.to(chatId).emit('chat_deleted', { chatId });
        io.socketsLeave(chatId);
        res.status(200).json({ message: "채팅방에서 나갔습니다." });
    }
    catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: "채팅방 나가기에 실패했습니다." });
    }
});
exports.deleteChat = deleteChat;
const handleMessage = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ uuid, message, time, roomId }) {
        try {
            const messageRecord = yield prisma.messages.create({
                data: {
                    uuid: Buffer.from(uuid, 'hex'),
                    chatId: parseInt(roomId),
                    content: message,
                    sentAt: new Date(time),
                }
            });
            io.to(roomId).emit("message", {
                uuid,
                message: messageRecord.content,
                time: messageRecord.sentAt.toLocaleTimeString(),
            });
        }
        catch (error) {
            console.error("Error saving message to database:", error);
        }
    }));
});
exports.handleMessage = handleMessage;
const handleJoinRoom = (socket, io) => {
    socket.on("join", (_a) => __awaiter(void 0, [_a], void 0, function* ({ uuid, roomId }) {
        try {
            const chatId = parseInt(roomId, 10);
            const previousMessages = yield prisma.messages.findMany({
                where: {
                    chatId: chatId,
                },
                orderBy: {
                    sentAt: 'asc',
                },
            });
            socket.emit('previousMessages', previousMessages.map(msg => ({
                uuid: msg.uuid,
                message: msg.content,
                time: msg.sentAt.toLocaleTimeString(),
            })));
            socket.to(roomId).emit('message', {
                user: 'admin',
                time: new Date().toLocaleTimeString(),
            });
        }
        catch (error) {
            console.error("Error fetching previous messages:", error);
        }
    }));
};
exports.handleJoinRoom = handleJoinRoom;
