import { /*React,*/ useEffect } from "react";
import HeaderWithBackButton from "../../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import InputText from "../InputText";
import "../../../styles/scss/components/user/my/settingAuthPassword.scss";
import { authPassword } from "../../../api/user.api";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

export interface SettingAuthPasswordProps {
  password: string;
}

const SettingAuthPassword = () => {
  const navigate = useNavigate();
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingAuthPasswordProps>();

  const handleAuthPassword = async (data: SettingAuthPasswordProps) => {
    try {
      const result = await authPassword(data);

      if (result.password === "correct") {
        navigate("/users/my/setting/password");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 401) {
          alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
        } else {
          console.error("비밀번호 인증 중 오류 발생:", error);
          alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    }
  };

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  return (
    <div className="setting-auth-password-container">
      <HeaderWithBackButton />
      <form onSubmit={handleSubmit(handleAuthPassword)}>
        <fieldset className="title">
          <p>비밀번호 확인</p>
          <InputText
            type="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
            })}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </fieldset>
        <button type="submit" className="complete-btn">
          다음
        </button>
      </form>
    </div>
  );
};

export default SettingAuthPassword;
