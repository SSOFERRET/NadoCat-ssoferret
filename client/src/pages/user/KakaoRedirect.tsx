import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUuid, useAuthStore } from "../../store/userStore";

const KakaoRedirect = () => {
  const navigate = useNavigate();
  const { storeLogin } = useAuthStore();

  const { uuid: loggedUser } = useAuthStore(); // 현재 로그인한 사용자의 UUID

  useEffect(() => {
    //처음 렌더링시 storedUuid설정
    const storedUuid = getUuid();

    if (!loggedUser && storedUuid) {
      useAuthStore.setState({ uuid: storedUuid }); // zustand의 상태 업데이트
    }
  }, [loggedUser]); // loggedUser가 업데이트될 때마다 실행

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // const code = urlParams.get("code");
    const uuid = urlParams.get("uuid"); // uuid도 추출해

    const handleKakaoLogin = async () => {
      try {
        if (uuid) {
          storeLogin(uuid, true);
          navigate("/");
        } else {
          console.error("uuid를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("카카오 로그인 중 오류 발생:", error);
        navigate("/users/login");
      }
    };

    handleKakaoLogin();
  }, [navigate, storeLogin]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoRedirect;
