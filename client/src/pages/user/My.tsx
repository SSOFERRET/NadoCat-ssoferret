import { useEffect, useState } from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";
import { myPage, userPage } from "../../api/user.api";
import { useNavigate} from "react-router-dom";
import LoadingCat from "../../components/loading/LoadingCat";
import { useAuthStore } from "../../store/userStore";

export interface MyProps {
  nickname: string;
  profileImageUrl: string;
  uuid: string;
  email?: string;
  detail?: string;
  authType?: string;
  autoLogin?: boolean;
}

export const My = () => {
  const navigate = useNavigate();
  const { uuid } = useAuthStore();
  const [userData, setUserData] = useState<MyProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMypage, setIsMypage] = useState(false);

  const currentUrl = window.location.pathname;
  const currentUuid = currentUrl.split("/").pop(); 

  useEffect(() => {
    const fetchUserData = async () => {
      
      if (!uuid) {
        alert("로그인이 필요합니다!");
        return;
      }

      try {
        setIsLoading(true);
        if (currentUuid) {
          const response =  currentUuid === "my" ? await myPage() : await userPage(currentUuid);
            setUserData(response.user);
            setIsMypage(currentUuid === "my" || currentUuid === uuid ? true : false);

        }
      } catch (error) {
        console.error("마이페이지 정보를 가져오는 데 실패했습니다: ", error);
      } finally {
        setIsLoading(false); 
      }
    };

    if (uuid) {
      fetchUserData();
    }
  }, [uuid, currentUuid, navigate]); 

  if (isLoading) {
    return <LoadingCat />;
  }

  const handleAvatarClick = () => {
    if (uuid === currentUuid) {
      // 본인의 마이페이지일 때 프로필 사진 크게 보기 모달 열기
      // 예: openModal(userData.profileImageUrl);
    }
  };

  return (
    <>
      {userData && (
        <div
          className={
            currentUuid === uuid ? "my-container" : "user-container"
          }
        >
          <MyInfo
            nickname={userData.nickname}
            profileImageUrl={userData.profileImageUrl}
            uuid={userData.uuid}
            onAvatarClick={handleAvatarClick}
            isMyPage={isMypage} 

            userData={userData}
          />

          <p>{userData.detail}</p>
          <MyTab isMyPage={isMypage} />
        </div>
      )}
    </>
  );
};

export default My;
