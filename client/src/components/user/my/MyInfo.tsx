import React, { useEffect, useState } from "react";
import "../../../styles/scss/components/user/my/myInfo.scss";
// import { IoIosSettings } from "react-icons/io";
import Avatar from "../../common/Avatar";
import { AiOutlineSetting } from "react-icons/ai";
import { deleteProfile, uploadProfile } from "../../../api/user.api";
import ProfileChangeModal from "./ProfileChangeModal";

export interface MyInfoProps {
  nickname: string;
  profileImageUrl: string;
  uuid: string;
  onAvatarClick?: () => void
}


const MyInfo = ({ nickname, uuid, profileImageUrl, onAvatarClick }: MyInfoProps) => {
  console.log("MyInfo의 uuid:" , uuid);
  const [isOpenModal, setIsOpenModal] = useState(false); //모달 여닫는거 저장
  const [avatarUrl, setAvatarUrl] = useState(profileImageUrl);

  //모달 열기
  const handleOpenProfileChange = () => {
    setIsOpenModal(true);
  };

  //모달 닫기
  const handleCloseProfileChange = () => {
    setIsOpenModal(false);
  };

  //사진 업로드
  const handleImageUpload = async (file: File) => {
    try {
        const newImageUrl = await uploadProfile(file);
        // setAvatarUrl(newImageUrl);
        setAvatarUrl(`${newImageUrl}?timestamp=${new Date().getTime()}`); //이미지 캐싱방지
        setIsOpenModal(false);

    } catch (error) {
        console.error("프로필 업로드 에러: ",error);
    }
  }

  //기본이미지 변경
  const handleDefaultImage = async () => {
    const defaultImageUrl = "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png";
    await deleteProfile(defaultImageUrl);
    setAvatarUrl(defaultImageUrl);
    setIsOpenModal(false);
  }

useEffect(() => {
    setAvatarUrl(profileImageUrl);
}, [profileImageUrl]);
  
  return (
    <div className="info-container">

      {/* Avatar에 onClick이라는 함수를 넣을 수 있습니다. 여기다가 원하는 동작을 하는 함수를 props로 전달하면 됩니다. */}
      <Avatar size="lg" nickname={nickname} profileImage={avatarUrl}  onClick={onAvatarClick}/>

      <div className="nickname-container">
        <div className="nickname-text">
          <span>{nickname}</span>
          <span>님</span>
          {/* <p>닉네임:{nickname}/uuid:{uuid} </p> */}
        </div>

        <div className="change-profile-btn">
            <button onClick={handleOpenProfileChange}>프로필 변경</button>
            {isOpenModal &&  <ProfileChangeModal 
            closeModal={handleCloseProfileChange}
            uploadImage={handleImageUpload} 
            setDefaultImage={handleDefaultImage}
            isShowMenu={isOpenModal}
            />}
        </div>

      </div>

      <button
        className="settings-button" onClick={() => {
          "프로필 설정 페이지 경로로 이동하게 설정, 함수를 외부에서 받아오면 이 컴포넌트 다양하게 사용 가능합니다.";
        }}
      >
        <AiOutlineSetting />
      </button>

    </div>
  );
};

export default MyInfo;
