import { /*React,*/ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputText from "../../components/user/InputText";
import { login } from "../../api/user.api";
import "../../styles/scss/pages/user/login.scss";
import { IoIosArrowBack } from "react-icons/io";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useAuthStore } from "../../store/userStore";
import { AxiosError } from "axios";

const KAKAO_AUTH_URL = `${
  import.meta.env.VITE_KAKAO_AUTH_URL
}?response_type=code&client_id=${
  import.meta.env.VITE_KAKAO_REST_API_KEY
}&redirect_uri=${
  import.meta.env.VITE_KAKAO_REDIRECT_URI
}&scope=profile_nickname,profile_image,account_email`;

export interface LoginProps {
  email: string;
  password: string;
  authType: string;
  autoLogin: boolean;
  uuid: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [autoLogin, setAutoLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const { storeLogin } = useAuthStore();
  console.log("storeLogin:::", storeLogin);


  const handleLogin = async (data: LoginProps) => {
    try {
      const response = await login({ ...data, autoLogin });
      const { user /*, tokens*/ } = response;

      useAuthStore.getState().storeLogin(user.uuid, autoLogin, true);
      navigate("/");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401
      ) {
        setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        console.error("로그인 중 오류 발생:", error);
        setLoginError("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <div className="login-container">
      <div className="login-header">
        <IoIosArrowBack className="back-button" onClick={handleBack} />
        <h1>로그인</h1>
      </div>

      <div className="login-content">
        <form onSubmit={handleSubmit(handleLogin)}>
          <fieldset className="input-field">
            <InputText
              type="email"
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
            <InputText
              type="password"
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

          {loginError && <p className="login-error-message">{loginError}</p>}

          <fieldset className="check-field">
            <label className="auto-login">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              자동로그인
            </label>
            <a href="/users/signup" className="signup-link">
              회원가입
            </a>
          </fieldset>

          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        <button className="login-btn kakao">
          <RiKakaoTalkFill />
          <a href={KAKAO_AUTH_URL}>Kakao로 시작하기</a>
        </button>
      </div>
    </div>
  );
};

export default Login;
