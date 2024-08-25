import { Request, Response } from "express";
import { createNotification, getNotificationListByReceiver, getNotificationsCount, updateNotificationsIsReadByReceiver } from "../../model/notification.model";
import { getUserId, getUserId2 } from "../missing/Missings";
import { StatusCodes } from "http-status-codes";
import { handleControllerError } from "../../util/errors/errors";
import { TCategoryId } from "../../types/category";
import { getFriendList } from "../../model/friend.model";
import { getCategoryUrlStringById } from "../../constants/category";
import { getPostAuthorUuid } from "../../model/common/uuid.model";
import { IListData } from "../../types/post";
import prisma from "../../client";
import { getPostsCount } from "../../model/missing.model";

/* CHECKLIST
* [x] 알람글 isRead update API
* [x] 실종고양이 제보글 => 게시글 게시자
* [x] 실종고양이 제보글 일치 여부 => 제보글 게시자
* [x] 실종고양이 제보글 수정 => 게시글 게시자
* [x] 실종고양이 수색 종료 => 모든 제보글 게시자 및 모든 즐겨찾기한 사용자
* [x] 신규 글 작성 => 친구
* [-] 좋아요 찍힘 => 게시글 게시자
* [x] 댓글 => 게시글 게시자
* [x] 친구 요청 => 요청 받은 사용자
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
  timestamp: string;
}

export const notifications: INotification[] = [];
let lastNotification: INoticiationData | null = null;  // 마지막 알림을 추적하기 위한 변수

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
      while (notifications.length) {
        await createNotification(notifications);
        notifications.forEach((notification) => {
          if (notification && userId && userIdBuffer.equals(notification.receiver)) {
            const notificationData = JSON.stringify({
              type: notification.type,
              sender: notification.sender,
              url: notification.url,
              timestamp: notification.timestamp
            })
            res.write(`data: ${notificationData}\n\n`);
          }
        });
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
    timestamp: timestamp.toISOString()
  };
};

export const notify = (data: INoticiationData) => {
  // 동일한 알림이 아닌지 확인하는 로직
  if (lastNotification &&
    lastNotification.type === data.type &&
    lastNotification.receiver.equals(data.receiver) &&
    lastNotification.sender.equals(data.sender) &&
    lastNotification.url === data.url &&
    lastNotification.commentId === data.commentId &&
    lastNotification.result === data.result) {
    console.log("중복된 알림이므로 생성하지 않습니다.");
    return;  // 중복된 알림이므로 처리하지 않습니다.
  }

  const timestamp = timestampObject();
  notifications.push({ ...data, ...timestamp });
  lastNotification = data;  // 마지막 알림을 업데이트
};

export const updateNotifications = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    updateNotificationsIsReadByReceiver(userId);

    return res.status(StatusCodes.OK);
  } catch (error) {
    handleControllerError(error, res);
  }
};

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
  }));
};

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

// export const getNotifitionList = async (
//   req: Request, res: Response
// ) => {
//   try {
//     const userId = await getUserId2();
//     const notifications = await getNotificationListByReceiver(userId, 10);
//     res.status(StatusCodes.OK).send(notifications);
//   } catch (error) {
//     console.log(error)
//   }

// };

export const getNotificationList = async (req: Request, res: Response) => {
  try {
    const limit = 10;
    const userId = await getUserId2(); //NOTE
    let notifications = await getNotificationListByReceiver(userId, limit);
    const count = await getNotificationsCount();

    const nextCursor = notifications.length === limit ? notifications[notifications.length - 1].notificationId : null;

    const result = {
      notifications,
      pagination: {
        nextCursor,
        totalCount: count
      }
    };

    res.status(StatusCodes.OK).send(result);

    await updateNotificationsIsReadByReceiver(userId);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
}