import React from "react";
import "../../styles/scss/pages/user/setting.scss";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { IoIosArrowForward } from "react-icons/io";


const Setting = () => {
  return (
    <div className="setting-container">
      <HeaderWithBackButton/>
      <ul className="setting-menu">
        <li>
          <span>닉네임 변경</span>
          <IoIosArrowForward/>
        </li>
        <li>
          <span>자기소개 변경</span>
          <IoIosArrowForward/>
        </li>
        <li>
          <span>비밀번호 변경</span>
          <IoIosArrowForward/>
        </li>
        <span className="inactive">회원 탈퇴</span>
      </ul>
    </div>
  );
};

export default Setting;
