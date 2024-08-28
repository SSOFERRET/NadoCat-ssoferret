import { useEffect, useState } from "react";
import "../../styles/scss/pages/user/my.scss";
import MyInfo from "../../components/user/my/MyInfo";
import MyTab from "../../components/user/my/MyTab";
import { myPage, userPage } from "../../api/user.api";
import { useNavigate} from "react-router-dom";
import { getUuid, useAuthStore } from "../../store/userStore";
import LoadingCat from "../../components/loading/LoadingCat";

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

  const { uuid: loggedUser } = useAuthStore(); // 현재 로그인한 사용자의 UUID
  console.log("loggedUser:", loggedUser);

  const [userData, setUserData] = useState<MyProps | null>(null);
  const [isLoading, setIsLoading] = useState(true); //로딩 상태관리

  const currentUrl = window.location.pathname;
  const currentUuid = currentUrl.split("/").pop(); // URL에서 마지막 부분 추출
  console.log("currentUuid::", currentUuid);

  const [isMypage, setIsMypage] = useState(false);

   useEffect(() => { //처음 렌더링시 storedUuid설정
      const storedUuid = getUuid();
      console.log("storedUuid::", storedUuid);

      if(!loggedUser && storedUuid){
        useAuthStore.setState({ uuid: storedUuid }); // zustand의 상태 업데이트
      }
  }, [loggedUser]);  // loggedUser가 업데이트될 때마다 실행

  //loggedUser가 업데이트될 때마다 로드
  useEffect(() => {
    const fetchUserData = async () => {
      if (!loggedUser) {
        //로그인 안됨
        alert("로그인이 필요합니다!");
        // navigate("/users/login");
        return;
      }

      try {
        setIsLoading(true); // 로딩 시작
        if (currentUuid) {
          const response =
            currentUuid === "my" ? await myPage() : await userPage(currentUuid);
            setUserData(response.user);
            
            setIsMypage(currentUuid === "my" || currentUuid === loggedUser ? true : false);
        }
      } catch (error) {
        console.error("마이페이지 정보를 가져오는 데 실패했습니다: ", error);
      } finally {
        setIsLoading(false); //로딩완료
      }
    };

    if (loggedUser) {
      fetchUserData();
    }
  }, [loggedUser, currentUuid, navigate]); // isLoggedIn 상태와 UserUuid를 의존성 배열에 추가


  if (isLoading) {
    return <LoadingCat />;
  }

  const handleAvatarClick = () => {
    if (loggedUser === currentUuid) {
      // 본인의 마이페이지일 때 프로필 사진 크게 보기 모달 열기
      // 예: openModal(userData.profileImageUrl);
    }
  };

  return (
    <>
      {userData && (
        <div
          className={
            currentUuid === loggedUser ? "my-container" : "user-container"
          }
        >
          <MyInfo
            nickname={userData.nickname}
            profileImageUrl={userData.profileImageUrl}
            uuid={userData.uuid}
            onAvatarClick={handleAvatarClick}
            isMyPage={isMypage} //본인 페이지 여부
            userData={userData}
          />
          {/* <Logout /> */}
          <p>{userData.detail}</p>
          <MyTab />
        </div>
      )}
    </>
  );
};

export default My;
