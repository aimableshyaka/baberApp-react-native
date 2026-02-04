import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export enum UserRole {
  CUSTOMER = "Customer",
  SALON_OWNER = "SalonOwner",
  ADMIN = "Admin",
}

export interface User {
  id: string;
  firstname: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore token on app startup
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("auth_token");
        const savedUser = await AsyncStorage.getItem("auth_user");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to restore token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreToken();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    try {
      await AsyncStorage.setItem("auth_token", newToken);
      await AsyncStorage.setItem("auth_user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error("Failed to save credentials:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("auth_user");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  };

  const restoreTokenFunc = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("auth_token");
      const savedUser = await AsyncStorage.getItem("auth_user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to restore token:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isSignedIn: !!token && !!user,
        login,
        logout,
        restoreToken: restoreTokenFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
