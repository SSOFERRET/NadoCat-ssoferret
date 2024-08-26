import React, { useEffect, useState } from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";
import { my } from "../../api/user.api";
import { useParams } from "react-router-dom";
import Logout from "../../components/user/my/Logout";
import { useAuthStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

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
  const {  uuid  } = useParams<{ uuid: string }>(); // URL에서 UUID를 가져옴
  const UserUuid = uuid || "";
  // 소영추가코드
  const navigate = useNavigate();

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
    // NOTE 여기 주석 처리 했습니다. 안그러면 무한 굴레에 빠져서 여기서 나갈 수 없어요. 대신 App.tsx에서 처리 했습니다.
    // if (!isLoggedIn) {
    //     window.location.href = "/users/login"; // 로그인이 안되어 있으면 리다이렉트
    //     return;
    // }

    const fetchUserData = async () => {
      try {
        const response = await my(UserUuid);
        console.log("response:", response);
        setUserData(response.user);
      } catch (error) {
        console.error("사용자 조회에 실패했습니다: ", error);
      }
    };

    fetchUserData();
  }, [isLoggedIn, UserUuid]); // isLoggedIn 상태와 UserUuid를 의존성 배열에 추가

  const handleAvatarClick = () => {
    if (UserUuid === myUuid) {
      // 본인의 마이페이지일 때 프로필 사진 크게 보기 모달 열기
      // 예: openModal(userData.profileImageUrl);
    }
  };

  //소영 추가 코드
  const handleSendToChat = () => {
    navigate("/chats/chat", {state: { userData: userData }})
}

  return (
    <div className="my-container">
      <MyInfo
        nickname={userData.nickname}
        profileImageUrl={userData.profileImageUrl}
        uuid={userData.uuid}
        onAvatarClick={handleAvatarClick}
      />
      <div style={{width: "7vh", fontSize:"15px", backgroundColor: "yellow"}} onClick={handleSendToChat}>채팅하기</div>
      <Logout />
      <MyTab></MyTab>
    </div>
  );
};

export default My;
