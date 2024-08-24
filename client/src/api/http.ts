import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/userStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_TIMEOUT = import.meta.env.VITE_DEFAULT_TIMEOUT;

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use(
    //request
    (config) => {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("generalToken="))
      ?.split("=")[1];

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

      console.log("HTTP 요청:", config); // 요청 로그 추가
      return config;
    },

    (error: AxiosError) => {
      console.error("요청 에러:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    //response
    (response) => {
      console.log("HTTP 응답:", response); // 응답 로그 추가
      return response;
    },

    async (error) => {
      console.error("응답 에러:", error); // 에러 로그 추가

      //access token 만료
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - 토큰만료");

        const originalRequest = error.config;
        if (!error.config._retry) {
          originalRequest._retry = true; //무한루프 방지

          try {
            const response = await axios.post(
              `${BASE_URL}/refresh-token`,
              {},
              { withCredentials: true }
            );
            if (response.status === 200) {
              return axiosInstance(originalRequest); // 기존 요청 재시도
            }
          } catch (error) {
            console.error("토큰 재발급 실패:", error);
            useAuthStore.getState().storeLogout(); // 실패 시 로그아웃
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
