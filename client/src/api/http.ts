import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/userStore";
// import { useAuthStore } from "../store/userStore";

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

  //[ ]수정2
  axiosInstance.interceptors.request.use(
    //request
    (config) => {
      // const token = document.cookie
      //   .split("; ")
      //   .find((row) => row.startsWith("generalToken="))
      //   ?.split("=")[1];

      const uuid = sessionStorage.getItem("uuid");

      // if (token) {
      //   config.headers["Authorization"] = `Bearer ${token}`;
      // }

      if (uuid) {
        config.headers["X-UUID"] = uuid;
      }

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
    //response
    (response) => {
      console.log("HTTP 응답:", response); // 응답 로그 추가
      return response;
    },

    async (error) => {
      console.error("응답 에러:", error); // 에러 로그 추가
      const {storeLogout} = useAuthStore.getState();
      const uuid = sessionStorage.getItem("uuid");

      //access token 만료
      if (error.response && error.response.status === 401) {
        console.log("401 Unauthorized - 토큰만료");

        const originalRequest = error.config;
        if (!error.config._retry) {
          originalRequest._retry = true; //무한루프 방지

          try {
            const response = await axios.post(
              `${BASE_URL}/users/refresh-token`,
              {},
              { withCredentials: true }
            );

            if (response.status === 200) {
              originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
              return axiosInstance(originalRequest); // 기존 요청 재시도
            }

            //Refresh token이 없어서 재발급에 실패한 경우
          } catch (error) {
            if(uuid){
              console.error("토큰 재발급 실패:", error);
              alert("세션이 만료되었습니다. 로그인 화면으로 이동합니다!");
              await storeLogout(uuid);
              window.location.href = "/users/login";
              return Promise.reject(error);
            }
          }

         // 위에서 이미 한번 요청해서 originalRequest._retry = true인데 또 요청(무한루프 막기위한 에러처리)
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
