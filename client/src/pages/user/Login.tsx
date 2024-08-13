import React from "react";
import "./Login.scss";

export interface Props {
  email: string;
  password: string;
  authType: string;
  autoLogin: string;
}

const Login = () => {
  return (
    <div className="login-container">
      <button className="login-btn"><a href="로그인">로그인</a></button>
      <button className="login-social-btn kakao"><a href="카카오 로그인">카카오 로그인</a></button>
      <button className="login-social-btn google"><a href="구글 로그인">구글 로그인</a></button>
      <h1 className="login-title">로그인</h1>
    </div>
  );
}

export default Login;