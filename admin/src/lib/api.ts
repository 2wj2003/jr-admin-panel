import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://api.jr.co.th";

export const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const requestUrl = error.config?.url || "";
        const isLoginRequest = requestUrl.includes("/admin/login");
        const isOnLoginPage = window.location.pathname === "/login";
        const isAdminApiCall = requestUrl.includes("/admin/");

        // Only redirect on 401 from admin API calls (not content API)
        if (isAdminApiCall && !isLoginRequest && !isOnLoginPage) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const strapiUrl = STRAPI_URL;
