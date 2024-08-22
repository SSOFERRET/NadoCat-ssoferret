import React, { useState } from "react";
import "../../styles/scss/components/user/profile.scss";
// import { IoIosSettings } from "react-icons/io";

interface ProfileProps {
  nickname: string;
  profileImageUrl: string;
}

const MyInfo = ({ nickname, profileImageUrl }: ProfileProps) => {
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
        <img src={profileImageUrl} alt="profileImage" className="user-circle" />
      </div>

      <div className="nickname-container">
        <div className="nickname-text">
          <p>{nickname}</p> 
          {/* <IoIosSettings /> */}
        </div>
        <div className="change-profile-btn">
          <button onClick={handleOpenProfileChange}>채팅하기</button>
        </div>
      </div>

        {/* {isOpenModal && <ProfileChangeModal closeModal={handleCloseProfileChange} />} */}

    </div>
  );
};

export default MyInfo;
