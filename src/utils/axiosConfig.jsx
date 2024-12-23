import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://video-management-app.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("authToken");
      console.log("Token being sent: ", token); // Debug log
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

export default axiosInstance;
