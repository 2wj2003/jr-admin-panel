import axios from "axios";

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_STRAPI_URL) {
    return process.env.NEXT_PUBLIC_STRAPI_URL;
  }
  // Production fallback
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.jr.co.th';
  }
  // Development fallback
  return 'http://localhost:1337';
};

const STRAPI_URL = getApiUrl();

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
  
  // Fallback to environment token for server-side or when no user token
  if (!config.headers.Authorization && process.env.NEXT_PUBLIC_STRAPI_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`;
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
