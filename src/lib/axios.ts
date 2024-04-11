import axios from "axios";
import { store } from "../redux/store";
import { refreshToken } from "../redux/slices/authSlice";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const state = store.getState();
  config.headers.authorization = state.auth.accessToken;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => {
    const response = { status: res.status, ...res.data };
    return Promise.resolve(response);
  },
  async (err) => {
    if (err.message === "Network Error" || err.status === 500) {
      const response = {
        status: 500,
        message: "Máy chủ không phản hồi",
      };
      return response;
    }

    const response = {
      status: err.response.status,
      ...err.response.data,
    };
    return Promise.reject(response);
  }
);

export default axiosClient;
