import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/",
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (res) => {
    const response = { status: res.status, ...res.data };
    // console.log("Response interceptor", response);
    return Promise.resolve(response);
  },
  (err) => {
    console.log("Trigger error");

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
    // console.log("Response interceptor", response);
    return Promise.reject(response);
  }
);

export default axiosClient;
