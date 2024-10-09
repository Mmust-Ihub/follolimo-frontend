import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  userToken: string | null;
  login: (username: string, password: string) => Promise<void>; // Change to include credentials
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("Token");
        console.log(token);
        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, [userToken]);

  const login = async (username: string, password: string, email: string) => {
    console.log("Attempting to log in with", username, password, email);
    try {
      // Call your authentication API here to get the token
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }), // Send username and password
      });

      if (!response.ok) {
        throw new Error("Login failed"); // Handle failed login
      }

      const data = await response.json();
      const token = data.token; // Assuming your API returns the token in this format

      await SecureStore.setItemAsync("Token", token);
      setUserToken(token);
      console.log("Logged in, token:", token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (
    email: string,
    username: string,
    password1: string,
    password2: string
  ) => {};

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      setUserToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
