import React, { useEffect, useState } from "react";
import "../../../styles/scss/components/user/my/myInfo.scss";
// import { IoIosSettings } from "react-icons/io";
import Avatar from "../../common/Avatar";
import { AiOutlineSetting } from "react-icons/ai";
import PostMenu from "../../communityAndEvent/PostMenu";
import { deleteProfile, uploadProfile } from "../../../api/user.api";
import FriendButton from "../../friend/FriendButton";
import { useNavigate } from "react-router-dom";
import { MyProps } from "../../../pages/user/My";
// import ProfileChangeModal from "./ProfileChangeModal";

export interface MyInfoProps {
  nickname: string;
  profileImageUrl: string;
  uuid: string;
  onAvatarClick?: () => void;
  isMyPage: boolean;
  userData: MyProps; // userData를 추가
}

const MyInfo = ({
  nickname,
  uuid,
  profileImageUrl,
  onAvatarClick,
  isMyPage,
  userData,
}: MyInfoProps) => {
  console.log("MyInfo의 uuid:", uuid);
  console.log("My의 userData:", userData);
  const [isOpenModal, setIsOpenModal] = useState(false); //모달 여닫는거 저장
  const [avatarUrl, setAvatarUrl] = useState(profileImageUrl);
  const navigate = useNavigate();

  const handelMenu = () => {
    setIsOpenModal((prev) => !prev);
  };

  //사진 업로드
  const handleImageUpload = async (file: File) => {
    try {
      const newImageUrl = await uploadProfile(file);
      // setAvatarUrl(newImageUrl);
      setAvatarUrl(`${newImageUrl}?timestamp=${new Date().getTime()}`); //이미지 캐싱방지
      setIsOpenModal(false);
    } catch (error) {
      console.error("프로필 업로드 에러: ", error);
    }
  };

  //기본이미지 변경
  const handleDefaultImage = async () => {
    const defaultImageUrl =
      "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png";
    await deleteProfile(defaultImageUrl);
    setAvatarUrl(defaultImageUrl);
    setIsOpenModal(false);
  };

  useEffect(() => {
    setAvatarUrl(profileImageUrl);
  }, [profileImageUrl]);

  //채팅 연결
  const handleSendToChat = () => {
    navigate("/chats/chat", { state: { userData: userData } });
  };



  return (
    <>
      <div className="info-container">
        <Avatar
          size="lg"
          nickname={nickname}
          profileImage={avatarUrl}
          onClick={onAvatarClick}
        />

        <div className={`nickname-container ${isMyPage ? "my-page" : "user-page"}`}>
          <div className="nickname-text">
            <span>{nickname}</span>
            <span>님</span>
            
          </div>

          {!isMyPage && (
            <div className="btn-set">
              <button className="chat-btn" onClick={handleSendToChat}>
                채팅하기
              </button>
              <FriendButton followingId={uuid} />
            </div>
          )}
        </div>
          {isMyPage && (
            <button
              className="settings-button"
              onClick={() => {
                handelMenu();
                ("프로필 설정 페이지 경로로 이동하게 설정, 함수를 외부에서 받아오면 이 컴포넌트 다양하게 사용 가능합니다.");
              }}
            >
              <AiOutlineSetting />
            </button>
          )}
      </div>

      <PostMenu
        menuType="user"
        isShowMenu={isOpenModal}
        showMenu={handelMenu}
        uploadImage={handleImageUpload}
        setDefaultImage={handleDefaultImage}
      />
    </>
  );
};

export default MyInfo;
