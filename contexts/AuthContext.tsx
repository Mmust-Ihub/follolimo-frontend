import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert, ToastAndroid } from "react-native";
import { router, SplashScreen } from "expo-router";
import { log } from "console";
import { usePushNotificationToken } from "@/hooks/useNotification";

interface AuthContextType {
  userToken: string | null;
  userDetails: {
    username: string;
    pk: string;
    email: string;
    role: string;
  } | null; // Allow userDetails to be null
  login: (username: string, password: string) => Promise<void>; // Change to include credentials
  logout: () => Promise<void>;
  isLoading: boolean;
  register: (
    email: string,
    username: string,
    password: string
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
  const [userDetails, setUserDetails] = useState<
    AuthContextType["userDetails"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    expoPushToken,
    errorMsg,
    isLoading: loading,
  } = usePushNotificationToken();

  if (errorMsg) {
    Alert.alert("Error in pushToken", errorMsg);
    console.error("Error getting push notification token:", errorMsg);
  }

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("Token");
        const userDetailsString = await SecureStore.getItemAsync("UserDetails");
        const userDetails: AuthContextType["userDetails"] = userDetailsString
          ? JSON.parse(userDetailsString)
          : null;

        if (token && userDetails) {
          setUserToken(token);
          console.log("details", userDetails);

          setUserDetails(userDetails);
          SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error loading token:", error);
        SplashScreen.hideAsync();
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };

    loadToken();
  }, []);

  const fetchUserDetails = async (token: string) => {
    try {
      if (token) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/user/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          console.log("User details:", data);
          // store to secure store
          await SecureStore.setItemAsync("UserDetails", JSON.stringify(data));
          setUserDetails(data);
        }
        if (response.status === 401) {
          console.log("Unauthorized access to user details");
          Alert.alert("Unauthorized", "Invalid or expired token");
          logout(); // Call the logout function from AuthContext
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // send ExpoPushToken to backend
  const sendPushTokenToBackend = async (
    pustToken: string,
    userAuthToken: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/expo-token/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${userAuthToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: pustToken }), // Send the token in the request body
        }
      );

      if (response.ok) {
        console.log("Push token sent successfully to backend");
      }
    } catch (error) {
      console.error("Error sending push token to backend:", error);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    console.log(
      "Login function called with username:",
      username,
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login/`
    );
    try {
      // Call your authentication API here to get the token
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login/`,
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
      }

      if (response.status === 200) {
        const data = await response.json();
        const token = data.accessToken;
        if (expoPushToken) {
          sendPushTokenToBackend(expoPushToken, token); // Send the push token to the backend
        } else {
          console.warn(
            "Expo push token is null, skipping push token submission."
          );
        }
        fetchUserDetails(token);
        await SecureStore.setItemAsync("Token", token);
        setUserToken(token);

        router.replace("/(tabs)");
        setIsLoading(false);
        // Alert.alert("Login Successful", "You are now logged in");
        // toast
        ToastAndroid.showWithGravity(
          "Login Successful",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
      if (response.status === 401) {
        const data = await response.json();

        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials"); // Handle failed login
      }
      if (response.status !== 200 && response.status !== 401) {
        const data = await response.json();

        setIsLoading(false);
        Alert.alert("Login failed", "Invalid credentials");
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
    password: string
  ) => {
    setIsLoading(true);

    try {
      // Call your authentication API here to get the token
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/register/ `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
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
      await SecureStore.deleteItemAsync("UserDetails");
      setUserToken(null);
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, userDetails, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
