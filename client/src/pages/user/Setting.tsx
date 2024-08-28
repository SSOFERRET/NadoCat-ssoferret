// import React from "react";
import "../../styles/scss/pages/user/setting.scss";

import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();

  const handleNickname = () => {
    navigate("/users/my/setting/nickname");
  };

  const handleAuthPassword = () => {
    navigate("/users/my/setting/auth-password");
  };

  const handleDetail = () => {
    navigate("/users/my/setting/detail");
  };

  return (
    <div className="setting-container">
      <HeaderWithBackButton />
      <ul className="setting-menu">
        <li onClick={handleNickname}>
          <span>닉네임 변경</span>
          <IoIosArrowForward />
        </li>
        <li onClick={handleDetail}>
          <span>자기소개 변경</span>
          <IoIosArrowForward />
        </li>
        <li onClick={handleAuthPassword}>
          <span>비밀번호 변경</span>
          <IoIosArrowForward />
        </li>
        <span className="inactive">회원 탈퇴</span>
      </ul>
    </div>
  );
};

export default Setting;
