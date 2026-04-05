import axios from "axios";

const PUBLIC_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const publicClient = axios.create({
  baseURL: PUBLIC_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to ensure data is properly serialized
publicClient.interceptors.request.use(
  (config) => {
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

export default publicClient;
