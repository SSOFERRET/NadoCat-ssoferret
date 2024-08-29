import { httpClient } from "../api/http";
import { SignupProps } from "../pages/user/Signup";
import { LoginProps } from "../pages/user/Login";
import {SettingNicknameProps} from "../components/user/my/SettingNickname";
import { SettingAuthPasswordProps } from "../components/user/my/SettingAuthPassword";
import { SettingPasswordProps } from "../components/user/my/SettingPassword";
import { SettingDetailProps } from "../components/user/my/SettingDetail";

export const signup = async (userData: SignupProps) => {
  try {
    const response = await httpClient.post("/users/signup", userData);
    return response.data;
  } catch (error) {
    console.error("signup error:", error);
    throw error;
  }
};

interface ILoginResponse {
  message: string;
  user: {
    email: string;
    nickname: string;
    uuid: string;
    status: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const login = async (data: LoginProps) => {
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/users/login",
      data
    );
    return response.data;
  } catch (error) {
    console.error("login error:", error);
    throw error;
  }
};

export const logout = async (uuid: string) => {
  try {
    const response = await httpClient.post("/users/logout", {uuid});
    return response.data;
  } catch (error) {
    console.error("login error:", error);
    throw error;
  }
};

export const getUuidFromRedis = async ()=> {
  try {
    const response = await httpClient.get(`/users/api/get-uuid`);
    console.log("HTTP 응답:", response); 
    return response.data.uuid;

  } catch (error) {
     console.error("Redis에서 UUID를 가져오는 중 오류 발생:", error);
    return null;
  }
}

export const storeLoginData = async (uuid: string, isAutoLogin: boolean) => {
  try {
    const response = await httpClient.post("/users/api/store-login", {uuid, isAutoLogin});
    console.log("storeLoginData 서버 응답 uuid:::::::::::::", uuid);
    
    
    if (response && response.data && response.data.uuid) {
      return response.data.uuid;
    } else {
      console.error("서버 응답에 uuid가 없습니다:", response);
      return null;
    }

  } catch (error) {
     console.error("Redis에서 UUID를 가져오는 중 오류 발생:", error);
    return null;
  }
}; 





export const userPage = async (userUuid: string) => {
  try {
    const response = await httpClient.get(`/users/user/${userUuid}`);
    return response.data;
  } catch (error) {
    console.error("사용자 프로필 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
};

export const myPage = async () => {
  try {
    const response = await httpClient.get(`/users/my`);
    return response.data;
  } catch (error) {
    console.error("마이페이지 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
};


export const myInterests = async () => {
  try {
    const response = await httpClient.get(`/users/my/interests`);
    return response.data;
  }catch (error) {
    console.error("관심글 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
}

export const getMyPosts = async (uuid: string) => {
  try {
    const response = await httpClient.post(`/users/my/myPosts`, {uuid});
    return response.data;
  } catch (error) {
    console.error("작성한글 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
}


export const uploadProfile = async (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const response = await httpClient.post("/users/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error("프로필 사진 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
};

export const deleteProfile = async (imageUrl: string) => {
  try {
    const response = await httpClient.put("/users/delete-profile", {
      imageUrl,
    });
    return response.data;
  } catch (error) {
    console.error("기본 사진 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
};

export const updateNickname = async (data: SettingNicknameProps) => {
  try {
    const response = await httpClient.put("/users/my/setting/nickname", data);
    return response.data;
  } catch (error) {
    console.error("닉네임 업데이트에 실패했습니다:", error);
    throw error;
  }
};

export const authPassword = async (data: SettingAuthPasswordProps) => {
  try {
    const response = await httpClient.post("/users/my/setting/auth-password", data);
    return response.data;
  } catch (error) {
    console.error("사용자 비밀번호 인증에 실패했습니다:", error);
    throw error;
  }
};

export const updatePassword = async (data: SettingPasswordProps) => {
  try {
    const response = await httpClient.put("/users/my/setting/password", data);
    return response.data;
  } catch (error) {
    console.error("비밀번호 업데이트에 실패했습니다:", error);
    throw error;
  }
};

export const updateDetail = async (data: SettingDetailProps) => {
  try {
    const response = await httpClient.put("/users/my/setting/detail", data);
    return response.data;
  } catch (error) {
    console.error("자기소개 업데이트에 실패했습니다:", error);
    throw error;
  }
};


export const deleteUser = async (uuid: string) => {
  try {
    const response = await httpClient.put("/users/my/setting/delete-user", {uuid});
    return response.data;
  } catch (error) {
    console.error("회원탈퇴에 실패했습니다:", error);
    throw error;
  }
}; 