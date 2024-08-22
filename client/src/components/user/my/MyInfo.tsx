import React, { useState } from "react";
import "../../../styles/scss/components/user/my/myInfo.scss";
import { IoIosSettings } from "react-icons/io";
import ProfileChangeModal from "./ProfileChangeModal";

interface MyInfoProps {
  nickname: string;
  profileImageUrl: string;
}

const MyInfo = ({ nickname, profileImageUrl }: MyInfoProps) => {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleOpenProfileChange = () => {
        setIsOpenModal(true);
    };
    
    const handleCloseProfileChange = () => {
        setIsOpenModal(false);
    };

  return (
    <div className="info-container">
      <div className="circle-container">
        <div className="circle"/>
        <img src={profileImageUrl} alt="profileImage" className="cat-circle" />
      </div>

      <div className="nickname-container">
        <div className="nickname-text">
          <p>{nickname}</p> 
          <IoIosSettings />
        </div>
        <div className="change-profile-btn">
          <button onClick={handleOpenProfileChange}>프로필변경</button>
        </div>
      </div>

        {isOpenModal && <ProfileChangeModal closeModal={handleCloseProfileChange} />}

    </div>
  );
};

export default MyInfo;