import axios from "axios";
import { useAuthStore } from "../store/auth-store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically and serialize data
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure data is sent as JSON string for POST/PUT/PATCH requests
    if (
      config.data &&
      (config.method === "post" ||
        config.method === "put" ||
        config.method === "patch")
    ) {
      if (typeof config.data === "object") {
        config.data = JSON.stringify(config.data);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ⚠️ Handle global errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.error("Unauthorized - redirecting");

      // Clear auth from Zustand
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
