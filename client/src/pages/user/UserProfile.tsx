import React from "react";
import "../../styles/scss/pages/user/my.scss";
import MyTab from "../../components/user/my/MyTab";
import Profile from "../../components/user/Profile";

export interface UserProfileProps {
    nickname: string;
    profileImageUrl: string;
}

export const UserProfile = () => {
  return (
    <div className="user-container">
        {/* <MyInfo nickname={nickname} profileImageUrl={profileImageUrl}></MyInfo> */}
        <Profile nickname="김땡떙" profileImageUrl="url"></Profile>
        <MyTab></MyTab>
    </div>
  );
};

export default UserProfile;
