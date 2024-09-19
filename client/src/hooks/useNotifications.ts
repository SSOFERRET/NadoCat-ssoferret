// import { create } from "zustand";
import { getNotifications } from "../api/notification.api";
import { useInfiniteQuery } from "@tanstack/react-query";

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

export interface IHasNewNotification {
  hasNewNotification: boolean;
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

  return {
    getNotificationList
  };
}



export default useNotifications;