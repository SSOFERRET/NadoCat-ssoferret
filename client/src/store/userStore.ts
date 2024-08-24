import axios from "axios";
import {create} from "zustand";

interface StoreState{
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  authType: string | null;
  uuid: string; 
  storeLogin: (uuid: string, isAutoLogin: boolean) => void;
  storeAuthType: (authType: string) => void;
  storeLogout: () => void;
}

//uuid
export const getUuid = () => {
    const uuid = localStorage.getItem("uuid");
    return uuid;
}

export const setUuid = (uuid: string) => {
    localStorage.setItem("uuid", uuid);
}


export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: !!getUuid(), // UUID가 존재하면 로그인 상태
  isAutoLogin: false,
  authType: null,
  uuid: getUuid() || "", 

  storeLogin: (uuid: string, isAutoLogin: boolean)  => {
    set({isLoggedIn: true, isAutoLogin});
    setUuid(uuid);

     // 자동로그인 상태 저장
     if (isAutoLogin) {
        localStorage.setItem("isAutoLogin", "true");
      } else {
        localStorage.removeItem("isAutoLogin");
      }
  },

  storeAuthType: (authType: string) => {
    set({authType});
  },

  storeLogout: async () => {
    try {
        await axios.post("/users/logout", {}, {withCredentials: true});
        set({isLoggedIn: false, isAutoLogin: false, authType: null, uuid: ""});
        localStorage.removeItem("uuid");
        localStorage.removeItem("isAutoLogin");
        window.location.href = "/users/login";

    } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
    }
  },
}));