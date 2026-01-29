import axios from "axios";

// Development machine IP - update this if your IP changes
// To find your IP: Run `ipconfig` and use the IPv4 Address under your active connection
const BASE_URL = "http://10.218.222.25:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("📤 API Request:", {
      url: config.baseURL + config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);
