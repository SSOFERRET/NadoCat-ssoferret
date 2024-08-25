import { InfiniteData } from "@tanstack/react-query";

import { INotificationPage } from "../../models/notification.model";
import React from "react";
import NotificationComponent from "./NotificationComponent";
import { INotificationFromDB } from "../../api/notification.api";

interface IProps {
  notifications: InfiniteData<INotificationPage> | undefined;
}

function NotificationList({ notifications }: IProps) {
  return (
    <section className="notification-list">
      {notifications?.pages.map((group: INotificationPage, i: number) => (
        <React.Fragment key={i}>
          {group.notifications?.map((notification: INotificationFromDB) => (
            <NotificationComponent
              key={notification.notificationId}
              notification={notification}
            />
          ))}
        </React.Fragment>
      ))}
    </section>
  );
}

export default NotificationList;
