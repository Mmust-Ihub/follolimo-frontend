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

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    console.log("Attempting to log in with", username, password);
    try {
      // Call your authentication API here to get the token
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/users/login/`,
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
        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials");
        // console.log(response);
        const data = await response.json();
        console.log(data);
        throw new Error("Login failed"); // Handle failed login
      }

      if (response.status === 200) {
        setIsLoading(false);
        const data = await response.json();
        const token = data.key; // Assuming your API returns the token in this format
        console.log(token);
        await SecureStore.setItemAsync("Token", token);
        setUserToken(token);
        Alert.alert("Login Successful", "You are now logged in");
        router.replace("/(tabs)");
        console.log("Logged in, token:", token);
      }
      if (response.status === 401) {
        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials");
        const data = await response.json();
        console.log(data);
        throw new Error("Login failed"); // Handle failed login
      }
      if (response.status !== 200 && response.status !== 401) {
        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials");
        const data = await response.json();
        console.log(data);
        throw new Error("Login failed"); // Handle failed login
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Login failed " + error + " Invalid credentials");
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
    console.log(
      "Attempting to register with",
      email,
      username,
      password1,
      password2
    );
    try {
      // Call your authentication API here to get the token
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/users/register/ `,
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
        setIsLoading(false);
        Alert.alert("Registration failed");
        const data = await response.json();
        console.log(data);
        console.log(response);
        throw new Error("Register failed"); // Handle failed login
      }

      if (response.status === 201) {
        setIsLoading(false);
        const data = await response.json();
        Alert.alert(
          "Registration Successful",
          "You can now login with your credentials"
        );
        router.replace("/(auth)/Login");
        console.log("Logged in, token:", data);
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
