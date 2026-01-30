import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Development machine IP - update this if your IP changes
// To find your IP: Run `ipconfig` and use the IPv4 Address under your active connection
const BASE_URL = "http://192.168.1.97:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 API Request:", {
      url: config.baseURL + config.url,
      method: config.method,
      hasAuth: !!token,
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

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("auth_token");
      AsyncStorage.removeItem("auth_user");
      console.warn("Token expired or invalid. User should login again.");
    }

    return Promise.reject(error);
  },
);
