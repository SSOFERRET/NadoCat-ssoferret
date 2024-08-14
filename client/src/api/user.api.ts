import { SignupProps } from "../pages/user/Signup";
import { httpClient } from "../api/http";
import { LoginProps } from "../pages/user/Login";

export const signup = async(userData: SignupProps) => {
    try {
        const response = await httpClient.post("/users/signup", userData);
        return response.data;
    } catch (error) {
        console.error("signup error:", error);
        throw error; // 혹은 에러 핸들링 로직 추가
    }
}

//비밀번호 변경요청

//비밀번호 변경

//백엔드 토큰받기
interface ILoginResponse {
    generalToken: string;
    refreshToken: string;
}

export const login = async(data: LoginProps) => {
    try {
        const response = await httpClient.post<ILoginResponse>("/users/login", data);
        return response.data;
    } catch (error) {
        console.error("login error:", error);
        throw error; // 혹은 에러 핸들링 로직 추가
    }
}