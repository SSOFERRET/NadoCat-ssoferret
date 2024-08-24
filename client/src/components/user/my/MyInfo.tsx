import React, { useState } from "react";
import "../../../styles/scss/components/user/my/myInfo.scss";
import ProfileChangeModal from "./ProfileChangeModal";
import { IoIosSettings } from "react-icons/io";
import Avatar from "../../common/Avatar";
import { AiOutlineSetting } from "react-icons/ai";

interface MyInfoProps {
  nickname: string;
  profileImageUrl: string;
  uuid: string;
}

const MyInfo = ({ nickname, uuid, profileImageUrl }: MyInfoProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenProfileChange = () => {
    setIsOpenModal(true);
  };

  const handleCloseProfileChange = () => {
    setIsOpenModal(false);
  };

  return (
    <div className="info-container">

      {/* Avatar에 onClick이라는 함수를 넣을 수 있습니다. 여기다가 원하는 동작을 하는 함수를 props로 전달하면 됩니다. */}
      <Avatar nickname={nickname} profileImage={profileImageUrl}/>

      <div className="nickname-container">
        <div className="nickname-text">
          <span>{nickname}</span>
          <span>님</span>
          {/* <p>닉네임:{nickname}/uuid:{uuid} </p> */}
        </div>
        <div className="change-profile-btn">
          <button onClick={handleOpenProfileChange}>프로필 변경</button>
        </div>
      </div>

      <button
        className="settings-button"
        onClick={() => {
          "프로필 설정 페이지 경로로 이동하게 설정, 함수를 외부에서 받아오면 이 컴포넌트 다양하게 사용 가능합니다.";
        }}
      >
        <AiOutlineSetting />
      </button>
    </div>
  );
};

export default MyInfo;
