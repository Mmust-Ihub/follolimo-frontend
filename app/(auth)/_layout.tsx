import { Stack } from "expo-router/stack";
import React from "react";

function auth() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="signup" />
      {/* <Stack.Screen name="forgot-password" /> */}
      <Stack.Screen name="OnBoarding" />
    </Stack>
  );
}

export default auth;
