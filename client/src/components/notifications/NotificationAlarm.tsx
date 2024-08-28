import React /*useEffect,*/ /*useEffect, useState*/ from "react";
import { BiBell } from "react-icons/bi";
// import { GoDotFill } from "react-icons/go";
import "./../../styles/scss/components/notification/notificationAlarm.scss";
// import { useAuthStore } from "../../store/userStore";
// import useNotifications from "../../hooks/useNotifications";

// interface INotificationData {
//   type: string;
//   sender: string;
//   url: string;
//   timestamp: string;
// }

const NotificationAlarm: React.FC = () => {
  // const [alarmExists, setAlarmExists] = useState<boolean>(false);
  // const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
  // const { uuid: loggedUser } = useAuthStore();
  // console.log("notification uuid", loggedUser);

  // // const { isAllRead, isAllReadLoading } = useNotifications();

  // const createEventSource = () => {
  //   const eventSource = new EventSource(
  //     `${BASE_URL}/notifications?userId=${loggedUser}`
  //   );

  //   eventSource.addEventListener("message", (event) => {
  //     try {
  //       const notification = JSON.parse(event.data);
  //       console.log(notification);
  //       setAlarmExists(true);
  //     } catch (error) {
  //       console.error("데이터 파싱 중 오류 발생:", error);
  //     }
  //   });

  //   eventSource.addEventListener("error", (error) => {
  //     console.error("SSE Error:", error);
  //     if (eventSource.readyState === EventSource.CLOSED) {
  //       setTimeout(createEventSource, 3000);
  //     }
  //   });

  //   return eventSource;
  // };

  // useEffect(() => {
  //   const eventSource = createEventSource();

  //   return () => {
  //     eventSource.close();
  //     console.log("SSE 연결이 닫혔습니다.");
  //     // setAlarmExists(!isAllRead);
  //   };
  // }, []);

  return (
    <div className="notification-icon">
      <BiBell className="bell-icon" />
      {/* {alarmExists && <GoDotFill className="new-sign" />} */}
    </div>
  );
};

export default NotificationAlarm;
