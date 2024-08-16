import { Prisma } from "@prisma/client";
import prisma from "../client";
import { INotification } from "../controller/notification/Notifications";

export const createNotification = async (notifications: INotification[]) => {
  return await prisma.notifications.createMany({
    data: notifications
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