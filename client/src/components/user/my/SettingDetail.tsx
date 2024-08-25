import React, { useEffect } from "react";
import HeaderWithBackButton from "../../../components/common/HeaderWithBackButton";
import { useNavigate } from "react-router-dom";
import InputText from "../InputText";
import "../../../styles/scss/components/user/my/settingDetail.scss";
import { updateDetail } from "../../../api/user.api";
import { useForm } from "react-hook-form";

export interface SettingDetailProps {
  detail: string;
}

const SettingDetail = () => {
  const navigate = useNavigate();

  const {
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingDetailProps>();

  const handleDetail = (data: SettingDetailProps) => {
    const result = updateDetail(data);
    console.log("자기소개가 변경되었습니다:", result);

    navigate("/users/my");
  };

  useEffect(() => {
    setFocus("detail");
  }, [setFocus]);

  return (
    <div className="setting-detail-container">
      <HeaderWithBackButton />
      <form onSubmit={handleSubmit(handleDetail)}>
        <fieldset className="title">
          <p>자기소개</p>
          <textarea
            placeholder="자기소개를 입력해주세요."
            {...register("detail", {
              required: "자기소개를 입력해주세요.",
            })}
          />
          {errors.detail && (
            <p className="error-message">{errors.detail.message}</p>
          )}
        </fieldset>
        <button type="submit" className="complete-btn">
          완료
        </button>
      </form>
    </div>
  );
};

export default SettingDetail;
