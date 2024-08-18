import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const startChat = async (req: Request, res: Response) => {
    const { userUuid, otherUserUuid, chatName } = req.body;

    let chat = await prisma.chats.findFirst({
        where: {
            OR: [
                {
                    uuid: userUuid
                },
                {
                    uuid: otherUserUuid
                }
            ]
        }
    });

    if (!chat) {
        chat = await prisma.chats.create({
            data: {
                chatName,
                uuid: userUuid,
                messages: {
                    create: [] 
                }
            }
        });
    }

    res.status(200).json(chat);
};


export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, userUuid, content } = req.body;

  try {
      const userUuidBuffer = Buffer.from(userUuid, 'hex'); 

      const message = await prisma.messages.create({
          data: {
              content,
              sentAt: new Date(),
              chats: {
                  connect: { chatId: chatId } 
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
  const { userUuid } = req.params;

  try {
      const userUuidBuffer = Buffer.from(userUuid, 'hex');

      const chats = await prisma.chats.findMany({
          where: {
              users: {
                  uuid: userUuidBuffer
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
