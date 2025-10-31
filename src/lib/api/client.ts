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
      localStorage.getItem("admin-token") ?? 
      localStorage.getItem("admin_token") ?? 
      localStorage.getItem("token");
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
      console.warn("غير مصرح بالدخول - Authentication required");
      
      // Only redirect to login if we're in admin routes
      if (window.location.pathname.startsWith("/admin")) {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/admin/login";
      }
      // Don't redirect for public routes - just let the error propagate
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
