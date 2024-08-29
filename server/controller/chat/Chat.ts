import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import moment from "moment-timezone";
const prisma = new PrismaClient();

let CHATID = "";

export const startChat = async (req: Request, res: Response, io: SocketIOServer) => {
  const { userUuid, otherUserUuid } = req.body;

  try {
    if (!userUuid || !otherUserUuid) {
      return res.status(400).json({ error: "Invalid UUIDs provided" });
    }

    const userUuidBuffer = Buffer.from(userUuid, "hex");
    const otherUserUuidBuffer = Buffer.from(otherUserUuid, "hex");

    let chat = await prisma.chats.findFirst({
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
            sentAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      chat = await prisma.chats.create({
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
    io.to(chatRoomId).emit("chat_created", { chatId: chatRoomId });
    CHATID = chatRoomId;
  } catch (error) {

    console.error(error)

    return res.status(500).json({ error: "Failed to start chat" });
  } finally {
    await prisma.$disconnect();
  }
};

export const sendMessage = async (req: Request, res: Response, io: SocketIOServer) => {
  const { uuid, content, sentAt } = req.body;
  const chatId = parseInt(CHATID);

  try {
    const userUuidBuffer = Buffer.from(uuid, "hex");

    const message = await prisma.messages.create({
      data: {
        content,
        sentAt: sentAt,
        chats: {

          connect: { chatId },
        },
        users: {
          connect: { uuid: userUuidBuffer },
        },
      },
      include: {
        chats: true,
        users: true,
      },
    });
    const formattedTime = moment(message.sentAt).tz(sentAt).format("YYYY-MM-DD HH:mm:ss");
    io.to(CHATID).emit("message", message, {
      user: uuid,
      message: message.content,
      time: formattedTime,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getChatList = async (req: Request, res: Response) => {
  const userUuid = req.headers["x-user-uuid"] as string;
  try {
    const userUuidBuffer = Buffer.from(userUuid, "hex");
    const chats = await prisma.chats.findMany({
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

            sentAt: "asc",
          },
          include: {
            users: true,
          },
        },
        users: true,
      },
    });

    const chatListWithUnreadCounts = chats.map((chat) => {
      const unreadCount = chat.messages.filter((msg) => !msg.isRead && msg.uuid !== userUuidBuffer).length;

      return {
        ...chat,
        unreadCount,
      };
    });

    res.status(200).json(chatListWithUnreadCounts);
  } catch (error) {
    console.error("Error fetching chat list:", error);
    res.status(500).json({ error: "Failed to fetch chat list" });
  } finally {
    await prisma.$disconnect();

  }
};

// userid 되는지 test
export const testUuid = async (req: Request, res: Response) => {
  const { uuid } = req.body;
  const userUuidBuffer = Buffer.from(uuid, "hex");
  try {
    const users = await prisma.users.findFirst({
      where: {
        uuid: userUuidBuffer,
      },
    });
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteChat = async (req: Request, res: Response, io: SocketIOServer) => {
  const { chatId } = req.body;

  try {
    await prisma.$transaction([
      prisma.messages.deleteMany({
        where: { chatId: chatId },
      }),
      prisma.chats.delete({
        where: { chatId: chatId },
      }),
    ]);

    io.to(chatId).emit("chat_deleted", { chatId });
    io.socketsLeave(chatId);
    res.status(200).json({ message: "채팅방에서 나갔습니다." });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "채팅방 나가기에 실패했습니다." });
  } finally {
    await prisma.$disconnect();
  }
};

export const handleMessage = async (socket: Socket, io: SocketIOServer) => {
  socket.on("sendMessage", async ({ uuid, message, time, roomId }) => {
    try {
      const messageRecord = await prisma.messages.create({
        data: {
          uuid: Buffer.from(uuid, "hex"),
          chatId: parseInt(roomId),
          content: message,
          sentAt: new Date(time),
        },
      });

      io.to(roomId).emit("message", {
        uuid,
        message: messageRecord.content,
        time: messageRecord.sentAt.toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Error saving message to database:", error);
    } finally {
      await prisma.$disconnect();
    }
  });
};

export const handleJoinRoom = (socket: Socket, io: SocketIOServer) => {
  socket.on("join", async ({ uuid, roomId }) => {
    try {
      const chatId = parseInt(roomId, 10);

      await prisma.messages.updateMany({
        where: {
          chatId: chatId,
          isRead: 0, // 읽지 않은 메시지만
          uuid: {
            not: Buffer.from(uuid, "hex"), // 자기 자신의 메시지는 제외
          },
        },
        data: {
          isRead: 1,
        },
      });

      const previousMessages = await prisma.messages.findMany({
        where: {
          chatId: chatId,
        },
        orderBy: {
          sentAt: "asc",
        },
      });

      socket.emit(
        "previousMessages",
        previousMessages.map((msg) => ({
          uuid: msg.uuid,
          message: msg.content,
          time: msg.sentAt.toLocaleTimeString(),
          isRead: msg.isRead,
        }))
      );

      socket.to(roomId).emit("message", {
        user: "admin",
        time: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Error fetching previous messages:", error);
    } finally {
      await prisma.$disconnect();
    }
  });
};