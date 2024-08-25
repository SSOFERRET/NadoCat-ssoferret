import React, { useState } from "react";
import "../../../styles/scss/components/user/my/myInfo.scss";
import ProfileChangeModal from "./ProfileChangeModal";
import { IoIosSettings } from "react-icons/io";
import Avatar from "../../common/Avatar";
import { AiOutlineSetting } from "react-icons/ai";
import PostMenu from "../../communityAndEvent/PostMenu";

interface MyInfoProps {
  nickname: string;
  profileImageUrl: string;
  uuid: string;
  onAvatarClick?: () => void;
}

const MyInfo = ({ nickname, uuid, profileImageUrl, onAvatarClick }: MyInfoProps) => {
  console.log("MyInfo의 uuid:", uuid);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenProfileChange = () => {
    setIsOpenModal(true);
  };

  const handleCloseProfileChange = () => {
    setIsOpenModal(false);
  };

  // NOTE 여기 추가했습니다.
  const handelMenu = () => {
    setIsOpenModal((prev) => !prev);
  };

  return (
    <>
      <div className="info-container">
        {/* Avatar에 onClick이라는 함수를 넣을 수 있습니다. 여기다가 원하는 동작을 하는 함수를 props로 전달하면 됩니다. */}
        <Avatar size="lg" nickname={nickname} profileImage={profileImageUrl} onClick={onAvatarClick} />

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
            handelMenu();
            ("프로필 설정 페이지 경로로 이동하게 설정, 함수를 외부에서 받아오면 이 컴포넌트 다양하게 사용 가능합니다.");
          }}
        >
          <AiOutlineSetting />
        </button>

        {/* 프로필 변경 버튼을 눌렀을 때 모달 띄우기 */}
        {/* {isOpenModal &&  <ProfileChangeModal closeModal={handleCloseProfileChange}></ProfileChangeModal>} */}
      </div>
      {/* 이게 props로 필요한 함수를 넘겨주시면 됩니다. PostMenu 컴포넌트 안에 꼭 타입을 옵셔널로 주셔야 합니다. 안그러면 다른 컴포넌트에 영향이 갑니다.*/}
      <PostMenu menuType="user" isShowMenu={isOpenModal} showMenu={handelMenu} />
    </>
  );
};

export default MyInfo;
