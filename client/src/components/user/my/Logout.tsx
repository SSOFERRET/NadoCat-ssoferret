import React from "react";
import { useAuthStore } from "../../../store/userStore";

const Logout = () => {
  const storeLogout = useAuthStore((store) => store.storeLogout);

  const handlerLogout = () => {
    storeLogout();
  };

  return (
    <button onClick={handlerLogout} className="logout-button">
      로그아웃
    </button>
  );
};

export default Logout;
