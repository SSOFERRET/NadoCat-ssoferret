import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/userStore";

export const useKakao = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    storeLogin,
    //  storeAutoLogin <= 훅 안에 없다고 나와 일단 주석처리 합니다
  } = useAuthStore();

  useEffect(() => {
    const fetchKakaoToken = async () => {
      const code = new URLSearchParams(location.search).get("code");

      if (code) {
        axios
          .get(`/auth/kakao/callback?code=${code}`)
          .then((response) => {
            const { accessToken /*, refreshToken*/ } = response.data.tokens;
            storeLogin(accessToken, false, true); // <= 인수 필요하다고 해서 일단 false 입력했습니다.

            //[ ]메인 페이지로 리다이렉트
            navigate("/signup"); //홈으로 수정
          })
          .catch((error) => {
            console.error("로그인 오류:", error);
          });
      }
    };

    fetchKakaoToken();
  }, [location.search, storeLogin /*, storeAutoLogin*/, navigate]);
};
