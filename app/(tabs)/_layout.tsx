import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native"; // Import ActivityIndicator

export default function TabLayout() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userToken, isLoading } = authContext;
console.log(isLoading, userToken)
  if (!isLoading && !userToken) {
    console.log("hello...");
    router.replace("/(auth)/login");
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
