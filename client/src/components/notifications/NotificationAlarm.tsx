import React, { useEffect } from "react";
import { BiBell } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import "./../../styles/scss/components/notification/notificationAlarm.scss";
import { useAuthStore } from "../../store/userStore";
import notificationStore from "../../store/notificationStore";

const NotificationAlarm: React.FC = () => {
  const { isLoggedIn, uuid: loggedUser } = useAuthStore();

  const { hasNewNotification, setHasNewNotification } = notificationStore();
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

  const createEventSource = () => {
    const eventSource = new EventSource(
      `${BASE_URL}/notifications?userId=${loggedUser}`
    );

    eventSource.addEventListener("message", () => {
      try {
        setHasNewNotification(true);
      } catch (error) {
        console.error("데이터 파싱 중 오류 발생:", error);
      }
    });

    eventSource.addEventListener("error", (error) => {
      console.error("SSE Error:", error);
      if (eventSource.readyState === EventSource.CLOSED) {
        setTimeout(createEventSource, 3000);
      }
    });

    return eventSource;
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const eventSource = createEventSource();

    return () => {
      eventSource.close();
    };
  }, [loggedUser]);

  return (
    <div className="notification-icon">
      <BiBell className="bell-icon" />
      {hasNewNotification && <GoDotFill className="new-sign" />}
    </div>
  );
};

export default NotificationAlarm;
