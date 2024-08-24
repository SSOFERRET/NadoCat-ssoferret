import React, { useEffect, useState } from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";
import { my } from "../../api/user.api";
import { useParams } from "react-router-dom";
import Logout from "../../components/user/my/Logout";

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
    const {uuid} = useParams<{uuid: string}>(); // URL에서 UUID를 가져옴
    const UserUuid = uuid || "";

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
                const response = await my(UserUuid); 
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
        <MyInfo nickname={userData.nickname} profileImageUrl="url" uuid={userData.uuid} />
        <Logout />
        <MyTab></MyTab>
    </div>
  );
};

export default My;
