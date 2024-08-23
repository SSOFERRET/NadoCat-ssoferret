import { httpClient } from "../api/http";
import { SignupProps } from "../pages/user/Signup";
import { LoginProps } from "../pages/user/Login";
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
    // generalToken: string;
    // refreshToken: string | null;
    // authLogin: boolean;
    // uuid: string;
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

export const my = async() => {
    try {
        console.log("1) my client api 진입")
        const response = await httpClient.get("/users/my");

        console.log("2) server갔다가 my client api 돌아옴:", response);
        return response.data;

    } catch (error) {
        console.error("my error:", error);
        throw error;
        
    }
}