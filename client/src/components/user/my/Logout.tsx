// import React from "react";
import { getUuid, useAuthStore } from "../../../store/userStore";
// import { logout } from "../../../api/user.api";

const Logout = () => {
  const storeLogout = useAuthStore((store) => store.storeLogout);

  const handlerLogout = async () => {
    const uuid = getUuid();
    if (!uuid) {
      console.error("UUID가 없습니다!");
      return;
    }

    try {
      await storeLogout(uuid);
      console.log("로그아웃 되었습니다.");
      console.log("uuid: ", uuid);

      window.location.href = "/users/login";
      //   window.location.reload();//강제 새로고침
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <button onClick={handlerLogout} className="logout-button">
      로그아웃
    </button>
  );
};

export default Logout;
