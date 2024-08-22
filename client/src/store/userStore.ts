import {create} from "zustand";

interface StoreState{
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  authType: string | null;
  userUuid: string | null; //uuid 추가
  storeLogin: (generalToken: string) => void;
  storeUuid: (userUuid: string) => void;
  storeAutoLogin: (refreshToken: string) => void;
  storeAuthType: (authType: string) => void;
  storeLogout: () => void;
}

export const getGeneralToken = () => {
  const generalToken = localStorage.getItem("generalToken");
  return {generalToken};
}

export const setGeneralToken = (generalToken: string) => {
  localStorage.setItem("generalToken", generalToken);
}

export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return {refreshToken}
}

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem("refreshToken", refreshToken);
}

//로그아웃시
export const removeToken = () => {
  localStorage.removeItem("generalToken");
  localStorage.removeItem("refreshToken");
}

export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: getGeneralToken().generalToken? true : false,
  isAutoLogin: false,
  authType: null,
  userUuid: null, //uuid 상태 추가

  storeLogin: (generalToken) => {
    set({isLoggedIn: true});
    setGeneralToken(generalToken);
  },

  storeUuid: (userUuid) => {
    set({userUuid});
  },

  storeAutoLogin: (refreshToken) => {
    set({isAutoLogin: true});
    setRefreshToken(refreshToken);
  },

  storeAuthType: (authType) => {
    set({authType});
  },

  storeLogout: () => {
    set({isLoggedIn: false, isAutoLogin: false, authType: null, userUuid: null});
    removeToken();
  },
}));