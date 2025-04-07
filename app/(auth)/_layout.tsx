// import { Colors } from "@/constants/Colors";
// import { ThemeContext } from "@/contexts/ThemeContext";
import { Stack } from "expo-router/stack";
import React, { useContext } from "react";
// import { StatusBar } from "react-native";

function auth() {
  // const themeContext = useContext(ThemeContext);
  // if (!themeContext) {
  //   throw new Error(
  //     "AuthContext, OnboardingContext, and ThemeContext must be used within their providers"
  //   );
  // }

  // const { isDarkMode } = themeContext;
  // const headerBackgroundColor = isDarkMode
  //   ? Colors.dark.headerBackground
  //   : Colors.light.headerBackground;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={headerBackgroundColor}
      /> */}
      <Stack.Screen name="Login" />
      <Stack.Screen name="signup" />
      {/* <Stack.Screen name="forgot-password" /> */}
      <Stack.Screen name="OnBoarding" />
    </Stack>
  );
}

export default auth;
