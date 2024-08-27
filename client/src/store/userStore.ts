import { create } from "zustand";
import { logout } from "../api/user.api";

interface StoreState {
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  authType: string | null;
  uuid: string;
  storeLogin: (uuid: string, isAutoLogin: boolean) => void;
  storeAuthType: (authType: string) => void;
  storeLogout: (uuid: string) => void;
}

//[ ]세션 수정1
export const getUuid = () => {
  const uuid = sessionStorage.getItem("uuid");
  // const uuid = localStorage.getItem("uuid");
  return uuid;
}

export const setUuid = (uuid: string) => {
  sessionStorage.setItem("uuid", uuid);
  // localStorage.setItem("uuid", uuid);
}


export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: !!getUuid(), // UUID가 존재하면 로그인 상태
  isAutoLogin: false,
  authType: null,
  uuid: getUuid() || "",

  storeLogin: (uuid: string, isAutoLogin: boolean)  => {
    set({isLoggedIn: true, isAutoLogin});
    // localStorage.setItem("uuid", uuid);
    setUuid(uuid);

     // 자동로그인 상태 저장
     if (isAutoLogin) {
        isAutoLogin= true;
        sessionStorage.setItem("isAutoLogin", "true");
      } else {
        sessionStorage.removeItem("isAutoLogin");
      }
  },
  storeAuthType: (authType: string) => {
    set({ authType });
  },

  storeLogout: async (uuid: string) => {
    try {
      sessionStorage.removeItem("uuid");
      //서버에 로그아웃 요청
      // await axios.post("/users/logout", { uuid }, { withCredentials: true });
      await logout(uuid);

      set({ isLoggedIn: false, isAutoLogin: false, authType: null, uuid: "" });

      console.log("uuid제거 성공!");
    } catch (error) {
      console.error("uuid제거 중 오류 발생:", error);
    }
  },

}));