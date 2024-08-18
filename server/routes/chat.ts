import { Request, Response } from "express";
import { getChatList, startChat } from "../controller/chat/Chat";
import express from "express";

const router = express.Router()

router.post("/startchat", startChat);

router.get("/chatlist/:userId", getChatList)

export default router;