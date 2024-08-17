import React from "react";
import "../../styles/scss/pages/user/login.scss";

const KAKAO_AUTH_URL = `${import.meta.env.VITE_KAKAO_AUTH_URL}?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&scope=profile_nickname,profile_image,account_email`;

export interface LoginProps {
  email: string;
  password: string;
  authType: string;
  autoLogin: string;
}

const Login = () => {
    if(!import.meta.env.VITE_KAKAO_REST_API_KEY || import.meta.env.VITE_KAKAO_REDIRECT_URI){
        console.error("카카오 값이 없음");
    }
    
    console.log("VITE_KAKAO_REST_API_KEY: ", import.meta.env.VITE_KAKAO_REST_API_KEY);
    console.log("VITE_KAKAO_REDIRECT_URI: ", import.meta.env.VITE_KAKAO_REDIRECT_URI);

  return (
    <div className="login-container">
      <button className="login-btn"><a href="로그인">로그인</a></button>
      <button className="login-social-btn kakao"><a href={KAKAO_AUTH_URL}>카카오 로그인</a></button>
      <button className="login-social-btn google"><a href="/auth/google">구글 로그인</a></button>
      <h1 className="login-title">로그인</h1>
    </div>
  );
}

export default Login;