import React, { useEffect, useState } from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";
import { my } from "../../api/user.api";

export interface MyProps {
    email: string;
    password: string;
    nickname: string;
    profileImageUrl: string;
    uuid: string;
    authType: string;
    autoLogin: boolean;
}

export const My = () => {
    const [userData, setUserData] = useState({
        email: "",
        nickname: "",
        profileImageUrl: "",
        uuid: "",
        authType: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await my(); //사용자 정보 요청 api
                console.log("response:", response);
                setUserData(response.user);

            } catch (error) {
                console.error("사용자 조회에 실패했습니다: ", error);
            }
        }

        fetchUserData();
    },[]);

  return (
    <div className="my-container">
        {/* <div><p>{userData.nickname}</p></div>
        <div><p>{userData.uuid}</p></div> */}
        {/* <MyInfo nickname={nickname} profileImageUrl={profileImageUrl}></MyInfo> */}
        <MyInfo nickname={userData.nickname} profileImageUrl="url" uuid={userData.uuid} />
        <MyTab></MyTab>
    </div>
  );
};

export default My;
