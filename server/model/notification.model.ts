import { Prisma } from "@prisma/client";
import prisma from "../client";
import { INotification } from "../controller/notification/Notifications";
import { IListData } from "../types/post";

export const createNotification = async (notifications: INotification[]) => {
  const newNotifications = notifications.map((notification) => {
    const receiver = Buffer.from(notification.receiver, "hex");
    const sender = Buffer.from(notification.sender, "hex");
    return {
      ...notification,
      receiver,
      sender
    }
  })
  return await prisma.notifications.createMany({
    data: newNotifications
  })
}

export const updateNotificationsIsReadByReceiver = async (receiver: Buffer) => {
  return await prisma.notifications.updateMany({
    where: {
      receiver
    },
    data: {
      isRead: true
    }
  })
}

// export const getNotificationListByReceiver = async (
//   receiver: Buffer
// ) => {
//   return await prisma.notifications.findMany({
//     where: {
//       receiver
//     }
//   })
// }

export const getMissingReporters = async (
  tx: Prisma.TransactionClient,
  missingId: number
) => {
  return await tx.missingReports.findMany({
    where: {
      missingId
    }
  })
}

export const getMissingFavoriteAdders = async (
  tx: Prisma.TransactionClient,
  postId: number
) => {
  return await tx.missingFavorites.findMany({
    where: {
      postId
    }
  })
}

export const getNotificationListByReceiver = async (
  receiver: Buffer,
  limit: number,
  cursor?: number | undefined
) => {
  return await prisma.notifications.findMany({
    where: {
      receiver,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { notificationId: cursor } : undefined,
    orderBy: [
      {
        notificationId: "desc",
      },
    ],
    select: {
      notificationId: true,
      receiver: false,
      sender: false,
      usersNotificationsSenderTousers: {
        select: {
          nickname: true,
          profileImage: true,
          uuid: true,
          id: true,
        },
      },
      type: true,
      url: true,
      isRead: true,
      timestamp: true
    },
  });
};

export const getNotificationsCount = async (receiver: Buffer) => {
  return await prisma.notifications.count({
    where: {
      receiver
    }
  });
};

export const getLatestNotificationByReceiver = async (receiver: Buffer) => {
  return await prisma.notifications.findFirst({
    where: {
      receiver,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
};