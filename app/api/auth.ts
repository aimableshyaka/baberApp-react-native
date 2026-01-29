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

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/api/users", data);
  return response.data;
};
export const loginUser = async (data: LoginData) => {
  const response = await api.post("/api/users/login", data);
  return response.data;
};
