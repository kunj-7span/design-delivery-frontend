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

export default publicClient;
