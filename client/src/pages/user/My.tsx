import React from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";

export interface MyProps {
    nickname: string;
    profileImageUrl: string;
}

export const My = () => {
  return (
    <div className="my-container">
        {/* <MyInfo nickname={nickname} profileImageUrl={profileImageUrl}></MyInfo> */}
        <MyInfo nickname="김땡떙" profileImageUrl="url"></MyInfo>
        <MyTab></MyTab>
    </div>
  );
};

export default My;
