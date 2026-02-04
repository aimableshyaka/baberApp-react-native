import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Base URL for the API
const BASE_URL = "http://10.218.222.25:3000";

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          "✅ Token attached to request:",
          token.substring(0, 20) + "...",
        );
      } else {
        console.warn("⚠️ No token found in AsyncStorage");
      }
    } catch (error) {
      console.error("❌ Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.status, error.response.data);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Token expired or invalid - could trigger logout here
        console.log("Unauthorized - token may be expired");
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
