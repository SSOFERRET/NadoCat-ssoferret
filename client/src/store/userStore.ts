import {create} from "zustand";

interface StoreState{
  isLoggedIn: boolean;
  isAutoLogin: boolean;
  authType: string | null;
  uuid: string; 
  storeLogin: (generalToken: string, refreshToken: string, uuid: string) => void;
  storeAuthType: (authType: string) => void;
  storeLogout: () => void;
}

//access token
export const getGeneralToken = () => {
  const generalToken = localStorage.getItem("generalToken");
  return generalToken;
}

export const setGeneralToken = (generalToken: string) => {
  localStorage.setItem("generalToken", generalToken);
}

//refresh token
export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return refreshToken;
}

export const setRefreshToken = (refreshToken: string) => {
    localStorage.setItem("refreshToken", refreshToken);
}

//uuid
export const getUuid = () => {
    const uuid = localStorage.getItem("uuid");
    return uuid;
}

export const setUuid = (uuid: string) => {
    localStorage.setItem("uuid", uuid);
}

//로그아웃시
export const removeToken = () => {
  localStorage.removeItem("generalToken");
  localStorage.removeItem("refreshToken");
}

export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: getGeneralToken()? true : false,
  isAutoLogin: false,
  authType: null,
  uuid: getUuid() || "", 

  storeLogin: (generalToken: string, uuid:string, refreshToken?:string)  => {
    set({isLoggedIn: true});
    setGeneralToken(generalToken);
    setUuid(uuid);

    if (refreshToken) {
        setRefreshToken(refreshToken);
        set({ isAutoLogin: true }); 
    }
  },

  storeAuthType: (authType: string) => {
    set({authType});
  },

  storeLogout: () => {
    set({isLoggedIn: false, isAutoLogin: false, authType: null, uuid: ""});
    removeToken();
    window.location.href = "/users/login";
  },
}));