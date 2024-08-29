import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/userStore';

const KakaoRedirect = () => {
  const navigate = useNavigate();
  const {storeLogin} = useAuthStore();
  const { uuid } = useAuthStore();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const uuidFromUrl = urlParams.get("uuid"); 

    console.log("code:", code);
    
    const handleKakaoLogin = async() => {
      try {
        const fetchedUuid = uuidFromUrl || uuid;
        if (fetchedUuid) {
          storeLogin(fetchedUuid, true, true);
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
   }, [navigate, uuid]);



  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoRedirect;
