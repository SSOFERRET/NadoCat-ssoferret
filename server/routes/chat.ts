import { Request, Response } from "express";
import { testUuid, getChatList, startChat, sendMessage, deleteChat } from "../controller/chat/Chat";
import express from "express";
import {ensureAutorization} from "../middleware/auth";
import { Server as SocketIOServer } from "socket.io";

const router = express.Router();

export default (io: SocketIOServer) => {
  router.post("/startchat",ensureAutorization, (req, res) => startChat(req, res, io));
  router.post("/sendmessage",ensureAutorization, (req, res) => sendMessage(req, res, io))
  router.get("/chatlist",ensureAutorization, getChatList);
  router.post("/delete",ensureAutorization, (req, res) => deleteChat(req, res, io));
  router.post("/", (req, res) => testUuid(req, res))
  return router;
};
