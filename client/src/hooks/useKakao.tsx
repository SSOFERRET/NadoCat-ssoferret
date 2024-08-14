import React, {useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/userStore";

const useKakao = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {storeLogin, storeAutoLogin} = useAuthStore();
    
    useEffect(() => {
        const fetchKakaoToken = async () => {
            const code = new URLSearchParams(location.search).get("code");
    
            if(code) {
                axios.post("/auth/kakao", {code})
                .then((response) => {
                    //로그인 성공시
                    console.log("로그인 성공: ", response.data);
    
                    //서버로부터 받은 jwt토큰 저장하고 로그인 처리
                    const { accessToken, refreshToken } = response.data.tokens;
                    storeLogin(accessToken);
                    
                    if(refreshToken) {
                        storeAutoLogin(refreshToken);
                    }
    
                    //[ ]추가적으로 메인 페이지로 리다이렉트 또는 사용자 상태 업데이트
                    navigate("/users/signup");//임시
    
                }).catch((error) => {
                    console.log("로그인 오류:", error);
                });
            } 
        }

        fetchKakaoToken();
    }, [location.search, storeLogin, storeAutoLogin, navigate]);

  return (
    <div>카카로 로그인 중</div>
  )
}

export default useKakao;