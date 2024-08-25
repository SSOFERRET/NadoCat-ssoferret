import React, { useEffect, useState } from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";
import { my } from "../../api/user.api";
import { useParams } from "react-router-dom";
import Logout from "../../components/user/my/Logout";
import { useAuthStore } from "../../store/userStore";

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

    const isLoggedIn = useAuthStore((store) => store.isLoggedIn); // 로그인 상태 가져오기
    const myUuid = useAuthStore((store) => store.uuid); // 현재 로그인된 사용자의 uuid 가져오기

    useEffect(() => {
    //     if (!isLoggedIn) {
    //         window.location.href = "/users/login"; // 로그인이 안되어 있으면 리다이렉트
    //         return;
    //     }

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
    },[isLoggedIn, UserUuid]); // isLoggedIn 상태와 UserUuid를 의존성 배열에 추가

    const handleAvatarClick = () => {
        if(UserUuid === myUuid){
             // 본인의 마이페이지일 때 프로필 사진 크게 보기 모달 열기
            // 예: openModal(userData.profileImageUrl);
        }
    };


  return (
    <div className="my-container">
        <MyInfo nickname={userData.nickname} profileImageUrl={userData.profileImageUrl} uuid={userData.uuid} onAvatarClick={handleAvatarClick}/>
        {/* <Logout /> */}
        <MyTab></MyTab>
    </div>
  );
};

export default My;
