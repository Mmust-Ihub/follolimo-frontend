import { Stack } from "expo-router/stack";
import React from "react";

function auth() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="SignUp" />
    </Stack>
  );
}

export default auth;
