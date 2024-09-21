import { useNavigate } from "react-router-dom";
import {
  // INotification,
  INotificationFromDB,
} from "../../hooks/useNotifications";
import { formatAgo } from "../../utils/format/format";
import Avatar from "../common/Avatar";
import "./../../styles/scss/components/notification/notificationComponent.scss";
import { GoDotFill } from "react-icons/go";

interface IProps {
  notification: INotificationFromDB;
}

type TNotify =
  | "newPost"
  | "comment"
  | "update"
  | "match"
  | "follow"
  | "found"
  | "like";

const NotificationComponent = ({ notification }: IProps) => {
  const navigate = useNavigate();

  const { profileImage, nickname, uuid } =
    notification.usersNotificationsSenderTousers;

  const getMessage = (type: TNotify) => {
    switch (type) {
      case "newPost" as TNotify:
        return `이 새로운 게시글을 작성했습니다.`;
      case "comment" as TNotify:
        return `이 새로운 댓글을 작성했습니다.`;
      case "follow" as TNotify:
        return `이 회원님을 팔로우했습니다.`;
      case "like" as TNotify:
        return `으로부터 좋아요를 받았습니다.`;
    }
  };
  // notification.isRead = true;

  const handleNavigatePost = () => {
    navigate(notification.url);
  };

  const handleNavigateUser = () => {
    navigate(`/users/${uuid}/profile`); //NOTE hex로 변경하기
  };
  return (
    <section
      className={`notification-component ${
        notification.isRead ? "readen" : "not-readen"
      }`}
    >
      <div className="avatar-sign">
        {!notification.isRead && <GoDotFill id="dot" />}
        <Avatar
          profileImage={profileImage}
          nickname={nickname}
          onClick={handleNavigateUser}
        />
      </div>

      <div className="notification" onClick={handleNavigatePost}>
        <span className="message">
          <span className="nickname">{nickname}</span> 님
          {getMessage(notification.type as TNotify)}
        </span>
        <span className="timestamp">{formatAgo(notification.timestamp)}</span>
      </div>
    </section>
  );
};

export default NotificationComponent;
