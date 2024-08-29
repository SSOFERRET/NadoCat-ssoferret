import { create } from "zustand";
import { logout, storeLoginData } from "../api/user.api";

export interface StoreState {
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  uuid: string;
  authType?: string | null;
  storeAutoLogin: (isAutoLogin: boolean) => void
  storeLogin: (uuid: string, isAutoLogin: boolean, isLoggedIn: boolean ) => void;
  storeLogout: (uuid: string) => void;
}



export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: false,
  isAutoLogin: false,
  authType: null,
  uuid: "",

  storeLogin: async (uuid: string, isAutoLogin: boolean, isLoggedIn: boolean)  => {
    try {
      await storeLoginData(uuid, isAutoLogin);
      
      set({isLoggedIn, uuid, isAutoLogin});

        
      } catch (error) {
      console.error("서버로 데이터 전송 중 오류 발생:::::::", error);
    }
  },

  storeAutoLogin: (isAutoLogin: boolean) => {
    set({ isAutoLogin });
  },

  storeLogout: async (uuid: string) => {
    try {
      await logout(uuid); 
      set({ isLoggedIn: false, isAutoLogin: false, uuid: "" });

      console.log("로그아웃 성공!");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  },

}));
