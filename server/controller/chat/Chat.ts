import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Server as  SocketIOServer} from 'socket.io';
import { Socket } from 'socket.io';

const prisma = new PrismaClient();

export const startChat = async (req: Request, res: Response, io: SocketIOServer) => {
  const { userUuid, otherUserUuid, chatName, chatid } = req.body;

  const userUuidBuffer = Buffer.from(userUuid.replace(/-/g, ''), 'hex');
  const otherUserUuidBuffer = Buffer.from(otherUserUuid.replace(/-/g, ''), 'hex');
  try{
    let chat = await prisma.chats.findFirst({
      where: {
        OR: [
          {
            uuid: userUuidBuffer,
            other_uuid: otherUserUuidBuffer
          },
          {
            uuid: otherUserUuid,
            other_uuid: otherUserUuidBuffer
          }
        ]
      }
    });
    if (!chat) {
      chat = await prisma.chats.create({
        data: {
          uuid: userUuidBuffer,
          other_uuid: otherUserUuidBuffer,
          messages: {
          create: [] 
        }
      }
    });
    const chatRoomId = chat.chatId.toString();
    io.to(chatRoomId).emit('chat_created', { chatId: chatRoomId, chatName });
  }

  req.app.get('io').to(userUuid).emit('join_chat', { chatId: chat.chatId });
  res.status(200).json(chat);

}  catch (error){
    res.status(500).json({ error: "Failed to start chat" });
  }
}


export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, userUuid, content } = req.body;

  try {
      const userUuidBuffer = Buffer.from(userUuid, 'hex'); 

      const message = await prisma.messages.create({
          data: {
              content,
              sentAt: new Date(),
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

      req.app.get('io').to(chatId.toString()).emit('message', message);

      res.status(200).json(message);
  } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
  }
};

export const getChatList = async (req: Request, res: Response) => {
  const userUuid = req.user.uuid;

  try {
      const chats = await prisma.chats.findMany({
          where: {
              users: {
                  uuid: userUuid
              }
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
  } catch (error) {
      console.error("Error fetching chat list:", error);
      res.status(500).json({ error: "Failed to fetch chat list" });
  }
};

export const handleMessage = async (socket: Socket, io: SocketIOServer) => {
  socket.on("sendMessage", async ({ uuid, message, time, roomId }) => {
    try {
      const messageRecord = await prisma.messages.create({
        data: {
          uuid: Buffer.from(uuid.replace(/-/g, ''), 'hex'),
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

    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  });
};

export const handleJoinRoom = (socket: Socket, io: SocketIOServer) => {
    socket.on("join", async ({ uuid, roomId }) => {
      socket.join(roomId);
        
      const previousMessages = await prisma.messages.findMany({
        where: {
          chatId: parseInt(roomId),
        },
        orderBy: {
          sentAt: 'asc',
        },
      });

      socket.emit('previousMessages', previousMessages.map(msg => ({
        uuid: Buffer.from(msg.uuid).toString('hex'),
        message: msg.content,
        time: msg.sentAt.toLocaleTimeString(),
      })));
  
      socket.to(roomId).emit('message', {
        user: 'admin',
        time: new Date().toLocaleTimeString(),
      });
    });
  };
  
