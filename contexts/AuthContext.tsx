import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { router } from "expo-router";

interface AuthContextType {
  userToken: string | null;
  login: (username: string, password: string) => Promise<void>; // Change to include credentials
  logout: () => Promise<void>;
  isLoading: boolean;
  register: (
    email: string,
    username: string,
    password1: string,
    password2: string
  ) => Promise<void>;
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

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      // Call your authentication API here to get the token
      const response = await fetch(
        `https://fololimo-api-eight.vercel.app/api/v1/users/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }), // Send username and password
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials");
        throw new Error("Login failed"); // Handle failed login
      }

      if (response.status === 200) {
        const data = await response.json();
        const token = data.key; // Assuming your API returns the token in this format

        await SecureStore.setItemAsync("Token", token);
        setUserToken(token);

        router.replace("/(tabs)");
        setIsLoading(false);
        // Alert.alert("Login Successful", "You are now logged in");
      }
      if (response.status === 401) {
        const data = await response.json();

        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials"); // Handle failed login
        throw new Error("Login failed");
      }
      if (response.status !== 200 && response.status !== 401) {
        const data = await response.json();

        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials");
        throw new Error("Login failed");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Login failed " + error);
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password1: string,
    password2: string
  ) => {
    setIsLoading(true);

    try {
      // Call your authentication API here to get the token
      const response = await fetch(
        `https://fololimo-api-eight.vercel.app/api/v1/users/register/ `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password1: password1,
            password2: password2,
          }), // Send username and password
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setIsLoading(false);
        Alert.alert("Registration failed");
        throw new Error("Register failed"); // Handle failed login
      }

      if (response.status === 201) {
        const data = await response.json();

        router.replace("/(auth)/Login");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Registration failed " + error);
      console.error("Register failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("Token");
      setUserToken(null);
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
