import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  getGeneralToken,
  setGeneralToken,
  getRefreshToken,
  removeToken,
} from "../store/userStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_TIMEOUT = import.meta.env.VITE_DEFAULT_TIMEOUT;

const refreshTokenReq = async () => {
  const refreshToken = getRefreshToken().refreshToken;

  try {
    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    setGeneralToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    removeToken();

    window.location.href = "/users/login";
    return null;
  }
};

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "content-type": "application/json",
      Authorization: getGeneralToken() ? `Bearer ${getGeneralToken()}` : "",
    },
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use(
    //request
    (config) => {
      config.headers["Authorization"] = `Bearer ${getGeneralToken()}`;
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    //response
    (response) => {
      return response;
    },

    async (error) => {
      //access token 만료
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - 토큰만료");

        const originalRequest = error.config;
        const newAccessToken = await refreshTokenReq();

        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); //기존요청 재시도
        
        } else {
          removeToken();
          window.location.href = "/users/login";
          return;
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
