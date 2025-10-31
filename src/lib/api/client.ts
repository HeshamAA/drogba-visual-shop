import axios from "axios";

const RAW_BASE_URL =
  (import.meta as any).env?.VITE_STRAPI_URL || "http://localhost:1337";
const API_URL = RAW_BASE_URL.replace(/\/$/, "") + "/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// ✅ Interceptor لإضافة الـ Token في كل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("admin_token") ?? localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("غير مصرح بالدخول، سيتم تسجيل الخروج تلقائيًا");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
