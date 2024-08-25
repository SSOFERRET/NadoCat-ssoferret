import { httpClient } from "../api/http";
import { SignupProps } from "../pages/user/Signup";
import { LoginProps } from "../pages/user/Login";
import {SettingNicknameProps} from "../components/user/my/SettingNickname";
import { SettingAuthPasswordProps } from "../components/user/my/SettingAuthPassword";
import { SettingPasswordProps } from "../components/user/my/SettingPassword";
// import  {Post}  from "../pages/MyPage";

export const signup = async (userData: SignupProps) => {
  try {
    const response = await httpClient.post("/users/signup", userData);
    return response.data;
  } catch (error) {
    console.error("signup error:", error);
    throw error;
  }
};

//비밀번호 변경요청
//비밀번호 변경

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

// localStorage.getItem("uuid");
export const my = async (uuid: string) => {
  try {
    // const response = await httpClient.get(`/users/my`);
    const response = await httpClient.get(`/users/my/${uuid}`);
    return response.data;
  } catch (error) {
    console.error("마이페이지 정보를 가져오는 데 실패했습니다:", error);
    throw error;
  }
};

//이미지
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

//세팅
export const updateNickname = async (data: SettingNicknameProps) => {
  try {
    const response = await httpClient.put("/users/setting/nickname", data);
    return response.data;
  } catch (error) {
    console.error("닉네임 업데이트에 실패했습니다:", error);
    throw error;
  }
};

export const authPassword = async (data: SettingAuthPasswordProps) => {
  try {
    const response = await httpClient.put("/users/setting/auth-password", data);
    return response.data;
  } catch (error) {
    console.error("사용자 비밀번호 인증에 실패했습니다:", error);
    throw error;
  }
};

export const updatePassword = async (data: SettingPasswordProps) => {
  try {
    const response = await httpClient.put("/users/setting/password", data);
    return response.data;
  } catch (error) {
    console.error("비밀번호 업데이트에 실패했습니다:", error);
    throw error;
  }
};

export const updateDetail = async (data: SettingDetailProps) => {
  try {
    const response = await httpClient.put("/users/setting/detail", data);
    return response.data;
  } catch (error) {
    console.error("자기소개 업데이트에 실패했습니다:", error);
    throw error;
  }
};
