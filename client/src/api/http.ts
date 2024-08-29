import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/userStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
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

  //[ ]수정2
  axiosInstance.interceptors.request.use(
    (config) => {
    
      console.log("HTTP 요청:", config); 
      return config;
    },

    (error: AxiosError) => {
      console.error("요청 에러:", error);
      return Promise.reject(error);
    }
  );

  //[ ]수정3
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("HTTP 응답:", response); 
      return response;
    },

    async (error) => {
      console.error("응답 에러:", error); 
      const {storeLogout} = useAuthStore.getState();
      const {uuid} = useAuthStore();

      if (error.response && error.response.status === 401) {
        console.log("401 Unauthorized - 토큰만료");

        const originalRequest = error.config;
        if (!error.config._retry) {
          originalRequest._retry = true; 

          try {
            const response = await axios.post(
              `${BASE_URL}/users/refresh-token`,
              {},
              { withCredentials: true }
            );

            if (response.status === 200) {
              originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
              return axiosInstance(originalRequest);
            }

          } catch (error) {
            if(uuid){
              console.error("토큰 재발급 실패:", error);
              alert("세션이 만료되었습니다. 로그인 화면으로 이동합니다!");
              await storeLogout(uuid);
              window.location.href = "/users/login";
              return Promise.reject(error);
            }
          }

        }else {
            if(uuid){
              alert("세션이 만료되었습니다. 로그인 화면으로 이동합니다!");
              await storeLogout(uuid);
              window.location.href = "/users/login";
              return Promise.reject(error);
            }
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
