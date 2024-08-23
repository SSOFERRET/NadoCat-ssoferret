import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputText from "../../components/user/InputText";
import { login } from "../../api/user.api";
import "../../styles/scss/pages/user/login.scss";
import { IoIosArrowBack } from "react-icons/io";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../../store/userStore";

const KAKAO_AUTH_URL = `${import.meta.env.VITE_KAKAO_AUTH_URL}?response_type=code&client_id=${
  import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${
  import.meta.env.VITE_KAKAO_REDIRECT_URI
}&scope=profile_nickname,profile_image,account_email`;

export interface LoginProps {
  email: string;
  password: string;
  authType: string;
  autoLogin: boolean;
  uuid: string;
//   user: string[];
//   tokens: string[];
}

const Login = () => {
    const navigate = useNavigate();
    const [autoLogin, setAutoLogin] = useState(false);
    const {register, setFocus, handleSubmit, formState: {errors}} = useForm<LoginProps>();

    const handleLogin = (data: LoginProps) => {
        login({...data, autoLogin}).then((response) => {
            console.log("전체 response:", response);
            const {user, tokens} = response;

            useAuthStore.getState().storeLogin(tokens.accessToken);
            useAuthStore.getState().storeUuid(user.uuid);

            console.log("response.generalToken:",tokens.accessToken);
            console.log("response.uuid:",user.uuid);

            sessionStorage.setItem("uuid", user.uuid);
            if(tokens.refreshToken){
                useAuthStore.getState().storeAutoLogin(tokens.refreshToken);
            }

            navigate("/home");
        });
    }

    const handleBack = () => {
        navigate(-1); 
    }

    useEffect(() => {
        setFocus("email");
    }, [setFocus]);


//   if (!import.meta.env.VITE_KAKAO_REST_API_KEY || import.meta.env.VITE_KAKAO_REDIRECT_URI) {
//     console.error("카카오 값이 없음");
//   }
//   console.log(
//     "VITE_KAKAO_REST_API_KEY: ",
//     import.meta.env.VITE_KAKAO_REST_API_KEY
//   );
//   console.log(
//     "VITE_KAKAO_REDIRECT_URI: ",
//     import.meta.env.VITE_KAKAO_REDIRECT_URI
//   );

  return (
    <div className="login-container">
      <div className="login-header">
        <IoIosArrowBack className="back-button" onClick={handleBack} />
        <h1>로그인</h1>
      </div>

      <div className="login-content">
        <form onSubmit={handleSubmit(handleLogin)}>
          <fieldset className="input-field">
            <InputText type="email"
            placeholder="이메일"
            className="input-field"
            {...register("email", {
                required: "이메일을 입력해주세요.",
            })}
            />
            {errors.email && (
            <p className="error-message">{errors.email.message}</p>
            )}
          </fieldset>
          <fieldset className="input-field">
            <InputText type="password"
            placeholder="비밀번호"
            className="input-field"
            autoComplete="new-password"
            {...register("password", {
                required: "비밀번호를 입력해주세요.",
            })}
            />
            {errors.password && (
                <p className="error-message">{errors.password.message}</p>
            )}
          </fieldset>

          <fieldset className="check-field">
            <label className="auto-login">
            <input type="checkbox" checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)} />
            자동로그인
            </label>
          </fieldset>

          <button type="submit" className="login-btn">로그인</button>
          <button className="login-btn kakao"><RiKakaoTalkFill />
            <a href={KAKAO_AUTH_URL}>Kakao로 시작하기</a>
          </button>
          <button className="login-btn google"><FcGoogle />
            <a href="/auth/google">Google로 시작하기</a>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Login;
