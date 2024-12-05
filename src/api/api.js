import axios from "axios";
import store from "../redux/store";
import { saveJwtToken } from "../redux/userSlice";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof URLSearchParams) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    const jwtToken = store.getState().user.jwtToken;
    config.headers["authorization"] = jwtToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          "http://localhost:8080/reissue",
          null,
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.headers["authorization"];
        store.dispatch(saveJwtToken(newAccessToken));
        console.log("만료된 토큰 재발급 신청");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("리프레쉬 토큰으로 재발급 실패");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
