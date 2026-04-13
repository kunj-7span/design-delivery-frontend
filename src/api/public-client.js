import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Public axios client - no authentication headers
const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Serialize data for POST/PUT/PATCH requests
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

// Handle response errors
publicClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default publicClient;
