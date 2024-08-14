import { Request, Response } from "express";
import { TCategoryId } from "../../types/category";
import { CATEGORY } from "../../constants/category";
import { DATE } from "../../constants/date";

interface INotification {
  notificationId: number;
  type: string;
  receiver: Buffer;
  categoryId: TCategoryId;
  postId: number;
  timestamp: string;
}

export const notifications: INotification[] = [];

export const serveNotifications = (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    let userIdBuffer: Buffer;
    if (typeof userId === "string")
      userIdBuffer = Buffer.from(userId + "\0".repeat(16 - userId.length));

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const sendNotifications = () => {
      console.log(notifications);
      if (!userId) return;

      while (notifications.length) {
        const notification = notifications.shift();

        if (notification && userIdBuffer.equals(notification.receiver)) {
          res.write(`event: ${notification ? notification.type : undefined}\n`);
          res.write(`data: {
            notificationId: ${notification.notificationId},
            type: ${notification.type},
            categoryId: ${notification.categoryId},
            postId: ${notification.postId},
            timestamp: ${notification.timestamp}
          }\n\n`);
        }
      }
    };

    const intervalid = setInterval(sendNotifications, 10000);

    req.on('close', () => clearInterval(intervalid));
  } catch (error) {
    console.log(error)
  }
};

type TNotifyMissingReport = "new" | "update" | "match" | "unmatch";

const timestampObject = () => {
  const timestamp = new Date();

  return {
    notificationId: Math.floor((timestamp.getTime() - DATE.BASETIME) / 1000),
    timestamp: timestamp.toISOString()
  }
}

export const notifyMissingReport = (type: TNotifyMissingReport, postId: number, receiver: Buffer) => {
  const timestamp = timestampObject();

  return notifications.push({
    ...timestamp,
    type,
    receiver,
    categoryId: CATEGORY.MISSING_REPORTS,
    postId
  });
}