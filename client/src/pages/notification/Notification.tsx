import { getNotifications } from "../../api/notification.api";
import PostEmpty from "../../components/communityAndEvent/PostEmpty";
import NotificationList from "../../components/notifications/NotificationList";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import useNotifications from "../../hooks/useNotifications";
import "./../../styles/scss/pages/notification/notification.scss";

const Notification = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isEmpty,
  } = useNotifications();

  const moreRef = useIntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!hasNextPage) {
        return;
      }
      fetchNextPage();
    }
  });
  console.log(data?.pages);

  return (
    <section className="notification-container">
      {isLoading ? (
        <div>loading...</div>
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
