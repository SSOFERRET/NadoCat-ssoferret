import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputText from "../../components/user/InputText";
import { signup } from "../../api/user.api";
import "../../styles/scss/pages/user/signup.scss";
import { IoIosArrowBack } from "react-icons/io";
import CustomModal from "../../components/user/CustomModal";
import WelcomeCatImage from "../../assets/img/welcomeCat.png";

export interface SignupProps {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  //[x]이메일 및 비밀번호 유효성 검증
  const {
    register,
    setFocus,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupProps>();

  //[x]여기에서 폼 데이터 백엔드로 보내는 로직 추가!!
  const handleModalOpen = (data: SignupProps) => {
    signup(data).then(() => {
      setIsOpenModal(true);//회원가입 끝나면 modal open
    });
  };

  const handleModalClose = () => {
    setIsOpenModal(false);
    navigate("/users/login"); //modal 닫으면 login 이동
  };

  const handleBack = () => {
    navigate(-1);
  };

  //[x]첫번째 input에 focus
  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <div className="signup-container">
      <div className="signup-header">
        <IoIosArrowBack className="back-button" onClick={handleBack} />
        <h1>회원가입</h1>
      </div>

      <div className="signup-content">
        <form onSubmit={handleSubmit(handleModalOpen)}>
          <fieldset>
            <legend>이메일</legend>
            <InputText
              type="email"
              placeholder="email@email.com"
              className="input-field"
              {...register("email", {
                required: "이메일을 입력해주세요.",
              })}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </fieldset>

          <fieldset>
            <legend>닉네임</legend>
            <InputText
              type="text"
              placeholder="닉네임을 입력해주세요."
              className="input-field"
              {...register("nickname", {
                required: "닉네임을 입력해주세요.",
              })}
            />
            {errors.nickname && (
              <p className="error-message">{errors.nickname.message}</p>
            )}
          </fieldset>

          <fieldset>
            <legend>비밀번호</legend>
            <InputText
              type="password"
              placeholder="4자 이상 입력해주세요."
              className="input-field"
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
              })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
            <InputText
              type="password"
              placeholder="비밀번호를 한번 더 입력해주세요."
              className="input-field"
              {...register("confirmPassword", {
                required: "비밀번호를 한번 더 입력해주세요.",
                validate: (value) => {
                  return (
                    value === watch("password") ||
                    "비밀번호가 일치하지 않습니다."
                  );
                },
              })}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </fieldset>

          <button type="submit">완료</button>
        </form>
      </div>

      <CustomModal isOpen={isOpenModal} onClose={handleModalClose} title="가입이 완료되었습니다." 
      message={["동네 고양이 정보부터 커뮤니티까지", "로그인 후 다양한 서비스를 이용해보세요!"]}
      imageUrl={WelcomeCatImage} />

    </div>
  );
};

export default Signup;
