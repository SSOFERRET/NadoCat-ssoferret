"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_1 = require("../controller/chat/Chat");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.default = (io) => {
    router.post("/startchat", (req, res) => (0, Chat_1.startChat)(req, res, io));
    router.post("/sendmessage", (req, res) => (0, Chat_1.sendMessage)(req, res, io));
    router.get("/chatlist", Chat_1.getChatList);
    router.post("/delete", (req, res) => (0, Chat_1.deleteChat)(req, res, io));
    router.post("/", (req, res) => (0, Chat_1.testUuid)(req, res));
    return router;
};
