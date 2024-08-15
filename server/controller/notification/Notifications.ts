import { Request, Response } from "express";
import { createNotification, updateNotificationsIsReadByReceiver } from "../../model/notification.model";
import { getUserId } from "../missing/Missings";
import { StatusCodes } from "http-status-codes";
import { handleControllerError } from "../../util/errors/errors";
import { TCategoryId } from "../../types/category";
import { getFriendList } from "../../model/friend.model";
import { getCategoryUrlStringById } from "../../constants/category";
import { getPostAuthorUuid } from "../../model/common/uuid";

/* CHECKLIST
* [x] 알람글 isRead update API

*  [x] 실종고양이 제보글 => 게시글 게시자
*  [x] 실종고양이 제보글 일치 여부 => 제보글 게시자
*  [x] 실종고양이 제보글 수정 => 게시글 게시자
*  
*  [x] 실종고양이 수색 종료 => 모든 제보글 게시자 및 모든 즐겨찾기한 사용자
*  
*  [x] 신규 글 작성 => 친구
*  [-] 좋아요 찍힘 => 게시글 게시자
*  [x] 댓글 => 게시글 게시자
* 
*  [x] 친구 요청 => 요청 받은 사용자
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
      userIdBuffer = Buffer.from(userId, "hex");

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
    handleControllerError(error, res);
  }
};

type TNotify = "newPost" | "comment" | "update" | "match" | "follow" | "found" | "like";


const timestampObject = () => {
  const timestamp = new Date();

  return {
    // notificationTimeId: Math.floor((timestamp.getTime() - DATE.BASETIME) / 1000),
    timestamp: timestamp.toISOString()
  }
}

export const notify = (data: INoticiationData) => {
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
    handleControllerError(error, res);
  }
}

export const notifyNewPostToFriends = async (
  userId: Buffer,
  categoryId: TCategoryId,
  postId: number,
) => {
  const friends = await getFriendList(userId);

  friends.forEach((friend) => notify({
    type: "newPost",
    receiver: friend.followingId,
    sender: userId,
    url: `/boards/${getCategoryUrlStringById(categoryId)}/${postId}`
  }))
}

export const notifyNewComment = async (
  userId: Buffer,
  categoryId: TCategoryId,
  postId: number,
  cursor: number
) => {
  const postAuthor = await getPostAuthorUuid(categoryId, postId);
  notify({
    type: "comment",
    receiver: postAuthor,
    sender: userId,
    url: `/boards/${getCategoryUrlStringById(categoryId)}/${postId}/comments?cursor=${cursor}` //프론트 url에 맞출 것
  });
};

export const notifyNewLike = async (
  userId: Buffer,
  categoryId: TCategoryId,
  postId: number,
) => {
  const postAuthor = await getPostAuthorUuid(categoryId, postId);
  notify({
    type: "like",
    receiver: postAuthor,
    sender: userId,
    url: `/boards/${getCategoryUrlStringById(categoryId)}/${postId}` //프론트 url에 맞출 것
  });
};