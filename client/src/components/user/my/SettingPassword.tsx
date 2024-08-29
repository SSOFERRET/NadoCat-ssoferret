import { /*React,*/ useEffect } from "react";
import HeaderWithBackButton from "../../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import InputText from "../InputText";
import "../../../styles/scss/components/user/my/settingPassword.scss";
import { updatePassword } from "../../../api/user.api";
import { useForm } from "react-hook-form";

export interface SettingPasswordProps {
  password: string;
  confirmPassword: string;
}

const SettingPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    setFocus,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingPasswordProps>();

  const handlePassword = (data: SettingPasswordProps) => {
    updatePassword(data);

    navigate("/users/my");
  };

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  return (
    <div className="setting-password-container">
      <HeaderWithBackButton />
      <form onSubmit={handleSubmit(handlePassword)}>
        <fieldset className="title">
          <p>새 비밀번호</p>
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
          <p>비밀번호 확인</p>
          <InputText
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            className="input-field"
            {...register("confirmPassword", {
              required: "비밀번호를 한번 더 입력해주세요.",
              validate: (value) => {
                return (
                  value === watch("password") || "비밀번호가 일치하지 않습니다."
                );
              },
            })}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </fieldset>
        <button type="submit" className="complete-btn">
          완료
        </button>
      </form>
    </div>
  );
};

export default SettingPassword;
