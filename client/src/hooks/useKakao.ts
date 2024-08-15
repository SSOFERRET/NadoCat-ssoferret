import {useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/userStore";

export const useKakao = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {storeLogin, storeAutoLogin} = useAuthStore();
    
    useEffect(() => {
        const fetchKakaoToken = async () => {
            const code = new URLSearchParams(location.search).get("code");
    
            if(code) {
                axios.get(`/auth/kakao/callback?code=${code}`)
                .then((response) => {
                    console.log("로그인 성공: ", response.data);
    
                    const { accessToken, refreshToken } = response.data.tokens;
                    storeLogin(accessToken);
                    
                    if(refreshToken) {
                        storeAutoLogin(refreshToken);
                    }
    
                    //[ ]메인 페이지로 리다이렉트 
                    navigate("/signup");//홈으로 수정
    
                }).catch((error) => {
                    console.log("로그인 오류:", error);
                });
            } 
        }

        fetchKakaoToken();
    }, [location.search, storeLogin, storeAutoLogin, navigate]);
};