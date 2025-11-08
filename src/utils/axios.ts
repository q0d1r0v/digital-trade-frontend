import { API_CONFIG, API_ENDPOINTS } from "@/constants/api";
import i18n from "@/i18n";
import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": i18n.language ?? "",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            API_BASE_URL + API_ENDPOINTS.AUTH.REFRESH,
            {
              refresh_token: refreshToken,
            },
          );

          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem(
            "refresh_token",
            response.data.refresh_token ?? "",
          );

          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers["Authorization"] =
            `Bearer ${response.data.access_token}`;

          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem("access_token");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error.response?.data || error.message);
  },
);

export default api;
