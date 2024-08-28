import "../../styles/scss/components/common/actionBar.scss";
import { IPostUserInfo } from "../../models/community.model";
import Avatar from "./Avatar";
import { formatDate } from "../../utils/format/format";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GoHeartFill } from "react-icons/go";
import { getUuid, useAuthStore } from "../../store/userStore";
import {useNavigate} from "react-router-dom"; 
import { useEffect } from "react";

interface IProps {
  userInfo: IPostUserInfo;
  createdAt: string;
  showMenu: () => void;
  toggleLike: () => void;
  liked: boolean;
}

const ActionBar =  ({ userInfo, createdAt, showMenu, toggleLike, liked }: IProps) => {
  const {uuid} = useAuthStore();  // 현재 로그인된 사용자의 uuid
  const navigate = useNavigate(); //이동을 위해 추가

  console.log("액션바의 uuid: ", uuid);
  console.log("userInfo는 어디서?: ", userInfo);

  useEffect(() => { //처음 렌더링시 storedUuid설정
    const storedUuid = getUuid();
    console.log("storedUuid::", storedUuid);

    if(!uuid && storedUuid){
      useAuthStore.setState({ uuid: storedUuid }); 
    }
}, [uuid]);  // uuid 업데이트될 때마다 실행

    //Avatar클릭 시 동작 정의
    const handleAvatarClick = async() => {
      if(userInfo.uuid === uuid){
        navigate("/users/my");
      }else{
        navigate(`/users/user/${userInfo.uuid}`); //사용자 페이지 이동
      }
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
