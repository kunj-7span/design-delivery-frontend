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

// Request interceptor placeholder for future request-level hooks
publicClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Handle response errors
publicClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default publicClient;
