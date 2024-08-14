import { Request, Response } from "express";
import { createNotification, updateNotificationsIsReadByReceiver } from "../../model/notification.model";
import { getUserId } from "../missing/Missings";
import { StatusCodes } from "http-status-codes";

/* CHECKLIST
* [ ] 알람글 isRead update API

*  [x] 실종고양이 제보글 => 게시글 게시자
*  [x] 실종고양이 제보글 일치 여부 => 제보글 게시자
*  [x] 실종고양이 제보글 수정 => 게시글 게시자
*  
*  [-] 실종고양이 수색 종료 => 모든 제보글 게시자 및 모든 즐겨찾기한 사용자
*  
*  [-] 신규 글 작성 => 친구
*  [-] 좋아요 찍힘 => 게시글 게시자
*  [-] 댓글 => 게시글 게시자
* 
*  [-] 친구 요청 => 요청 받은 사용자
*  
*/

interface INoticiationData {
  type: TNotify;
  receiver: Buffer;
  sender: Buffer;
  url: string;
  commentId?: number;
  result?: string;
}

export interface INotification extends INoticiationData {
  // notificationTimeId: number;
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

    const sendNotifications = async () => {
      console.log(notifications);

      while (notifications.length) {
        await createNotification(notifications);
        notifications.forEach((notification) => {
          if (notification && userId && userIdBuffer.equals(notification.receiver)) {
            res.write(`data: {
              type: ${notification.type},
              sender: ${notification.sender},
              url: ${notification.url},
              timestamp: ${notification.timestamp}
            }\n\n`);
          }
        })
        notifications.length = 0;
      }
    };

    const intervalid = setInterval(sendNotifications, 10000);

    req.on('close', () => clearInterval(intervalid));


  } catch (error) {
    console.log(error)
  }
};

type TNotify = "newPost" | "newComment" | "update" | "match" | "unmatch" | "follow" | "found" | "unfound" | "like";


const timestampObject = () => {
  const timestamp = new Date();

  return {
    // notificationTimeId: Math.floor((timestamp.getTime() - DATE.BASETIME) / 1000),
    timestamp: timestamp.toISOString()
  }
}

export const notify = (data: INoticiationData) => {
  //NOTE commentId에 대한 처리. 페이지네이션 처리?
  const timestamp = timestampObject();

  return notifications.push({
    ...timestamp,
    ...data
  });
}

export const updateNotifications = async (req: Request, res: Response) => {
  // NOTE header의 user 내용으로 변경할 것
  try {
    const userId = await getUserId();
    updateNotificationsIsReadByReceiver(userId);

    return res.status(StatusCodes.OK);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }
} 