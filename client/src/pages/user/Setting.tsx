// import React from "react";
import "../../styles/scss/pages/user/setting.scss";

import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteUser } from "../../api/user.api";
import { useState } from "react";
import CustomModal from "../../components/user/CustomModal";
import { useAuthStore } from "../../store/userStore";

const Setting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uuid = location.state?.uuid;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const {storeLogout} = useAuthStore();

  const handleNickname = () => {
    navigate("/users/my/setting/nickname");
  };

  const handleAuthPassword = () => {
    navigate("/users/my/setting/auth-password");
  };

  const handleDetail = () => {
    navigate("/users/my/setting/detail");
  };

  const handleDeleteUser = async () => {
    if(!uuid){
      console.error("uuid가 없습니다!");
      return;
    }
    
    try {
      await deleteUser(uuid);
      await storeLogout(uuid);
      console.log("회원 탈퇴가 완료되었습니다 UUID:", uuid);

      navigate("/users/login");
    } catch (error) {
      console.error("회원탈퇴 중 오류 발생:", error);
    }finally {
      setIsOpenModal(false);
    }
  };

  const handleModalOpen = () => {
    setIsOpenModal(true); 
  };

  const handleLogoutCancel = () => {
    setIsOpenModal(false);
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
        <span className="inactive" onClick={handleModalOpen}>회원 탈퇴</span>
      </ul>
      <CustomModal
        size="sm"
        isOpen={isOpenModal}
        message={["정말 탈퇴 하시겠습니까?"]}
        buttons={[
          { label: "예", onClick: handleDeleteUser },
          { label: "아니오", onClick: handleLogoutCancel },
        ]}
      />
    </div>
  );
};

export default Setting;
