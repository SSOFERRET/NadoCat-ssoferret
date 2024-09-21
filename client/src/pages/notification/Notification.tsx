import { useEffect } from "react";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import LoadingCat from "../../components/loading/LoadingCat";
import NotificationList from "../../components/notifications/NotificationList";
import useNotifications from "../../hooks/useNotifications";
import notificationStore from "../../store/notificationStore";
import "./../../styles/scss/pages/notification/notification.scss";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Spinner from "../../components/loading/Spinner";

const Notification = () => {
  const { getNotificationList } = useNotifications();
  const { hasNewNotification, setHasNewNotification } = notificationStore();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
    refetch,
  } = getNotificationList();

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });

  useEffect(() => {
    setHasNewNotification(false);
  }, []);

  useEffect(() => {
    if (hasNewNotification) {
      refetch(); // 알림 리스트 새로고침
      setHasNewNotification(false); // 상태 초기화
    }
  }, [hasNewNotification]);

  return (
    <section className="notification-container">
      {isLoading ? (
        <LoadingCat />
      ) : (
        <>
          <div className="category">
            <span>알림</span>
          </div>
          {data?.pages && <NotificationList notifications={data} />}
          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <Spinner />}
          </div>
          {isEmpty && <PostEmpty />}

          <div className="more" ref={moreRef}>
            {isFetchingNextPage && <Spinner />}
          </div>
        </>
      )}
    </section>
  );
};

export default Notification;
