import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUuid, useAuthStore } from '../../store/userStore';

const KakaoRedirect = () => {
  const navigate = useNavigate();
  const {storeLogin} = useAuthStore();

  const { uuid: loggedUser } = useAuthStore(); // 현재 로그인한 사용자의 UUID
  console.log("loggedUser:", loggedUser);

  useEffect(() => { //처음 렌더링시 storedUuid설정
    const storedUuid = getUuid();
    console.log("storedUuid::", storedUuid);

  if (!loggedUser && storedUuid) {
    useAuthStore.setState({ uuid: storedUuid }); // zustand의 상태 업데이트
  }
}, [loggedUser]); // loggedUser가 업데이트될 때마다 실행


  useEffect(() => {
    console.log("카카오 페이지로 왔다");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const uuid = urlParams.get("uuid");  // uuid도 추출해
    console.log("code:", code);
    console.log("uuid:", uuid);
    console.log("urlParams:", urlParams);
    
    const handleKakaoLogin = async() => {
      console.log("handleKakaoLogin 호출됨"); // 추가된 로그
      try {
        if (uuid) {
          storeLogin(uuid, true);
          navigate("/");
        } else {
          console.error("uuid를 찾을 수 없습니다.");
        }
        
      } catch (error) {
        console.error("카카오 로그인 중 오류 발생:", error);
        navigate("/users/login");  
      }
    };

    handleKakaoLogin();
   }, [navigate, storeLogin]);


  return (
    <div>카카오 로그인 처리 중...</div>
  )
}

export default KakaoRedirect