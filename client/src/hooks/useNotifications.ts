// import { create } from "zustand";
import { getIsAllNotificationRead, getNotifications } from "../api/notification.api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export interface INotification {
  type: string;
  sender: string;
  url: string;
  timestamp: string;
}

export interface INotificationFromDB {
  notificationId: number,
  usersNotificationsSenderTousers: {
    nickname: string,
    profileImage: string | null,
    uuid: Buffer,
  }
  type: string,
  url: string,
  isRead: boolean,
  timestamp: string
}

// interface NotificationState {
//   alarms: INotification[];
//   setAlarms: (alarms: INotification[]) => void;
// }

// interface NotificationState {
//   alarms: INotification[];
//   setAlarms: (update: (prevAlarms: INotification[]) => INotification[]) => void;
// }

export interface IIsAllRead {
  isAllRead: boolean;
}

const useNotifications = () => {
  const getNotificationList = () => {
    const {
      data,
      isLoading,
      error,
      isFetching,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useInfiniteQuery({
      queryKey: ["notification"],
      queryFn: ({ pageParam = 0 }) => getNotifications({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextCursor = lastPage.pagination.nextCursor;
        if (nextCursor) {
          return nextCursor;
        }
        return undefined;
      },
    });

    const posts = data ? data.pages.flatMap((page) => page.notifications) : [];
    const isEmpty = posts.length === 0;

    return {
      data,
      isLoading,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
      isEmpty,
    }
  };


  const getIsAllRead = () => {
    const { data, isLoading } = useQuery({
      queryKey: ['isAllNotificationRead'],
      queryFn: getIsAllNotificationRead,
    });

    return [data, isLoading];
  }

  const [isAllRead, isAllReadLoading] = getIsAllRead();



  return {
    getNotificationList,
    isAllRead, isAllReadLoading
  };
}


export default useNotifications;