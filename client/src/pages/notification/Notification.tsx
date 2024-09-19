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
  const { setHasNewNotification } = notificationStore();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
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
