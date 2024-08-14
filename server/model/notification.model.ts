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
      isRead: 1
    }
  })
}