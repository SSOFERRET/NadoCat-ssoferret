import "../../styles/scss/components/common/actionBar.scss";
import { IPostUserInfo } from "../../models/community.model";
import Avatar from "./Avatar";
import { formatDate } from "../../utils/format/format";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GoHeartFill } from "react-icons/go";
import { useAuthStore } from "../../store/userStore";
import {useNavigate} from "react-router-dom"; 

interface IProps {
  userInfo: IPostUserInfo;
  createdAt: string;
  showMenu: () => void;
  toggleLike: () => void;
  liked: boolean;
}

const ActionBar = ({ userInfo, createdAt, showMenu, toggleLike, liked }: IProps) => {
  const {uuid} = useAuthStore();  // 현재 로그인된 사용자의 uuid
    const navigate = useNavigate(); //이동을 위해 추가

    //Avatar클릭 시 동작 정의
    const handleAvatarClick = () => {
        navigate(`/users/my/${userInfo.uuid}`); //마이페이지 이동
    }

  return (
    <div className="action-bar">
      <Avatar profileImage={userInfo.profileImage} nickname={userInfo.nickname} onClick={handleAvatarClick} />
      <div className="user-info">
        <div className="user-details">
          <span className="nickname">{userInfo.nickname}</span>
          <span className="date">{formatDate(createdAt)}</span>
        </div>
        <div className="post-buttons">
          <button className={`post-like ${liked ? "like" : "dislike"}`} onClick={() =>{
            uuid ? toggleLike() : navigate('/users/login')
          }}>
            <GoHeartFill />
          </button>
          {uuid === userInfo.uuid && <HiOutlineDotsVertical className="options-icon" onClick={showMenu} />}
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
