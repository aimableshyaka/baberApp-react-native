import { User } from "../_context/AuthContext";
import { api } from "./api";

interface RegisterData {
  firstname: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  user: User;
  token?: string;
}

export const registerUser = async (
  data: RegisterData,
): Promise<RegisterResponse> => {
  const response = await api.post("/api/users", data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/api/users/login", data);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/api/protected/profile");
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/users/logout");
};

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
}

export const forgotPassword = async (
  data: ForgotPasswordData,
): Promise<ForgotPasswordResponse> => {
  const response = await api.post("/api/users/forgot-password", data);
  return response.data;
};

interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (
  data: ResetPasswordData,
): Promise<ResetPasswordResponse> => {
  const response = await api.post("/api/users/reset-password", data);
  return response.data;
};
