import { getNotifications } from "../../api/notification.api";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import LoadingCat from "../../components/loading/LoadingCat";
import NotificationList from "../../components/notifications/NotificationList";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import useNotifications from "../../hooks/useNotifications";
import "./../../styles/scss/pages/notification/notification.scss";

const Notification = () => {
  const { getNotificationList } = useNotifications();
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
        </>
      )}
    </section>
  );
};

export default Notification;
