import "../../styles/scss/components/common/actionBar.scss";
import { IPostUserInfo } from "../../models/community.model";
import Avatar from "./Avatar";
import { formatDate } from "../../utils/format/format";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GoHeartFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/userStore";

interface IProps {
  userInfo: IPostUserInfo;
  createdAt: string;
  showMenu: () => void;
  toggleLike: () => void;
  liked: boolean;
}

const ActionBar = ({ userInfo, createdAt, showMenu, toggleLike, liked }: IProps) => {
  const { uuid } = useAuthStore();
  const navigate = useNavigate();

  console.log("액션바의 uuid: ", uuid);
  console.log("userInfo는 어디서?: ", userInfo);

  const handleAvatarClick = async () => {
    if (userInfo.uuid === uuid) {
      navigate("/users/my");
    } else {
      navigate(`/users/user/${userInfo.uuid}`);
    }
  };

  return (
    <div className="action-bar">
      <Avatar profileImage={userInfo.profileImage} nickname={userInfo.nickname} onClick={handleAvatarClick} />
      <div className="user-info">
        <div className="user-details">
          <span className="nickname">{userInfo.nickname}</span>
          <span className="date">{formatDate(createdAt)}</span>
        </div>
        <div className="post-buttons">
          <button
            className={`post-like ${liked ? "like" : "dislike"}`}
            onClick={() => {
              uuid ? toggleLike() : navigate("/users/login");
            }}
          >
            <GoHeartFill />
          </button>

          {uuid === userInfo.uuid && <HiOutlineDotsVertical className="options-icon" onClick={showMenu} />}
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
