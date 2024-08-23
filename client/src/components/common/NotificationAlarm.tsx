import React, { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";

const NotificationAlarm: React.FC = () => {
  const [alarmExists, setAlarmExists] = useState<boolean>(false);
  useEffect(() => {
    const userId: string = "74657374320000000000000000000000";
    const eventSource = new EventSource(
      `http://localhost:3000/notifications?userId=${userId}`
    );

    interface INotificationData {
      type: string;
      sender: string;
      url: string;
      timestamp: string;
    }

    eventSource.onmessage = function (event: MessageEvent) {
      try {
        const data: INotificationData = JSON.parse(event.data);
        console.log("알림 수신:", data);

        if (!alarmExists) setAlarmExists(true);
      } catch (error) {
        console.error("알림 처리 중 오류 발생:", error);
      }
    };

    eventSource.onerror = function (error: Event) {
      console.error("SSE 연결 오류:", error);
    };

    return () => {
      eventSource.close();
      console.log("SSE 연결이 닫혔습니다.");
    };
  }, []);

  return (
    <div>
      <BiBell />
      <h2>{alarmExists ? "있다!" : "없다!"}</h2>
    </div>
  );
};

export default NotificationAlarm;
