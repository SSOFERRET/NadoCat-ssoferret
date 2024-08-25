import React, { useEffect } from "react";
import HeaderWithBackButton from "../../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import InputText from "../InputText";
import "../../../styles/scss/components/user/my/settingNickname.scss";
import { updateNickname } from "../../../api/user.api";
import { useForm } from "react-hook-form";

export interface SettingNicknameProps {
  nickname: string;
}

const SettingNickname = () => {
  const navigate = useNavigate();

  const {
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingNicknameProps>();

  const handleNickname = (data: SettingNicknameProps) => {
    const result = updateNickname(data);
    console.log("닉네임이 변경되었습니다:", result);

    navigate("/users/my");
  };

  useEffect(() => {
    setFocus("nickname");
  }, [setFocus]);

  return (
    <div className="setting-nickname-container">
      <HeaderWithBackButton />
      <form onSubmit={handleSubmit(handleNickname)}>
        <fieldset className="title">
          <p>새 닉네임</p>
          <InputText
            type="text"
            placeholder="닉네임을 입력해주세요."
            {...register("nickname", {
              required: "닉네임을 입력해주세요.",
            })}
          />
          {/* {errors.nickname && (
            <p className="error-message">{errors.nickname.message}</p>
          )} */}
        </fieldset>
        <button type="submit" className="complete-btn">
          완료
        </button>
      </form>
    </div>
  );
};

export default SettingNickname;
