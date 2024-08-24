import { httpClient } from "../api/http";
import { SignupProps } from "../pages/user/Signup";
import { LoginProps } from "../pages/user/Login";
import axios from "axios";
// import  {Post}  from "../pages/MyPage";

export const signup = async(userData: SignupProps) => {
    try {
        const response = await httpClient.post("/users/signup", userData);
        return response.data;
    } catch (error) {
        console.error("signup error:", error);
        throw error; 
    }
}

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

export const login = async(data: LoginProps) => {
    try {
        const response = await httpClient.post<ILoginResponse>("/users/login", data);
        return response.data;
    } catch (error) {
        console.error("login error:", error);
        throw error;
    }
}

export const my = async(uuid: string) => {
    try {
        const response = await httpClient.get(`/users/my`);
        return response.data;

    } catch (error) {
        console.error("마이페이지 정보를 가져오는 데 실패했습니다:", error);
        throw error;
        
    }
}