import { create } from "zustand";
import { logout } from "../api/user.api";

interface StoreState {
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  authType: string | null;
  uuid: string;
  storeAutoLogin: (isAutoLogin: boolean) => void
  storeLogin: (uuid: string, isAutoLogin: boolean) => void;
  storeAuthType: (authType: string) => void;
  storeLogout: (uuid: string) => void;
}

//[x]uuid
export const getUuid = () => {
  const uuid = sessionStorage.getItem("uuid");
  // const uuid = localStorage.getItem("uuid");
  return uuid;
}

export const setUuid = (uuid: string) => {
  sessionStorage.setItem("uuid", uuid);
  // localStorage.setItem("uuid", uuid);
}

//[ ]AutoLogin상태 저장
export const getAutoLogin = () => {
  const autoLogin = localStorage.getItem("isAutoLogin") === "true";
  return autoLogin;
}

export const setAutoLogin = (isAutoLogin: boolean) => {
  if (isAutoLogin) {
    localStorage.setItem("isAutoLogin", "true");
  } else {
    localStorage.removeItem("isAutoLogin");
  }
}

export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: !!getUuid(), // UUID가 존재하면 로그인 상태
  isAutoLogin: getAutoLogin(), // localStorage에서 자동 로그인 상태 불러오기
  authType: null,
  uuid: getUuid() || "",

  storeLogin: (uuid: string, isAutoLogin: boolean) => {

    set({ isLoggedIn: true, isAutoLogin });
    setUuid(uuid);

    // 자동로그인 상태 저장
    setAutoLogin(isAutoLogin);
  },

  storeAuthType: (authType: string) => {
    set({ authType });
  },

  storeAutoLogin: (isAutoLogin: boolean) => {
    set({ isAutoLogin });
    setAutoLogin(isAutoLogin);
  },

  storeLogout: async (uuid: string) => {
    try {
      sessionStorage.removeItem("uuid"); //동기적 처리
      await logout(uuid); //비동기적 처리
      set({ isLoggedIn: false, isAutoLogin: false, authType: null, uuid: "" });

    } catch (error) {
      console.error("uuid제거 중 오류 발생:", error);
    }
  },

}));