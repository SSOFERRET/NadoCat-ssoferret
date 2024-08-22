import "../../styles/scss/components/common/actionBar.scss";
import { IPostUserInfo } from "../../models/community.model";
import Avartar from "./Avartar";
import { formatDate } from "../../utils/format/format";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GoHeartFill } from "react-icons/go";

interface IProps {
  userInfo: IPostUserInfo;
  createdAt: string;
  showMenu: () => void;
  toggleLike: () => void;
  liked: boolean;
}

const ActionBar = ({ userInfo, createdAt, showMenu, toggleLike, liked }: IProps) => {
  return (
    <div className="action-bar">
      <Avartar profileImage={userInfo.profileImage} nickname={userInfo.nickname} />
      <div className="user-info">
        <div className="user-details">
          <span className="nickname">{userInfo.nickname}</span>
          <span className="date">{formatDate(createdAt)}</span>
        </div>
        <div className="post-buttons">
          <button className={`post-like ${liked ? "like" : "dislike"}`} onClick={toggleLike}>
            <GoHeartFill />
          </button>
          <HiOutlineDotsVertical className="options-icon" onClick={showMenu} />
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
