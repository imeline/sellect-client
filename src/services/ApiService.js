import axios from "axios";
import { useAuth } from "../context/AuthContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true, // 쿠키를 포함한 요청 허용
});

// API 요청 시 사용할 커스텀 훅 (컨텍스트에서 토큰 가져오기)
const useApiService = () => {
  const { accessToken, logout } = useAuth();

  // 요청 인터셉터: Authorization 헤더 추가
  apiClient.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 토큰 만료 시 처리
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // 토큰 만료 시 로그아웃 처리
        logout();
      }
      return Promise.reject(error);
    }
  );

  // 공통 API 메서드
  const get = (url, config = {}) => apiClient.get(url, config);
  const post = (url, data, config = {}) => apiClient.post(url, data, config);
  const put = (url, data, config = {}) => apiClient.put(url, data, config);
  const del = (url, config = {}) => apiClient.delete(url, config);

  return { get, post, put, del };
};

export default useApiService;