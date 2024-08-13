import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {getToken, removeToken} from "../store/userStore";

const BASE_URL = "http://localhost:3000"; //서버주소
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig)  => {
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            "content-type": "application/json",//json을 통해 content교환
            // Authorization: getToken()? getToken().generalToken : "",
            Authorization: getToken()? `Bearer ${getToken().generalToken}` : "",
        },
        withCredentials: true,
        ...config,
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            config.headers["Authorization"] = `${getToken()}`;
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            //로그인 만료
            if(error.response.status === 401){ //로그인 토큰 만료
                removeToken();
                window.location.href = "/users/login";
                return;
            } 
            return Promise.reject(error);
        }
    );
    return axiosInstance;
}

export const httpClient = createClient();