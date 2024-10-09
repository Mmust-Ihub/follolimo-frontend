import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, Tabs } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native"; // Import ActivityIndicator
import { Colors } from "@/constants/Colors";


export default function TabLayout() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userToken, isLoading } = authContext;
  console.log(isLoading, userToken);
  if (!isLoading && !userToken) {
    console.log("hello...");
    router.replace("/(auth)/Login");
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: Colors.light.tabIconSelected,  }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          headerTitleAlign: "center",
          headerTintColor: Colors.light.tabIconSelected,
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="leaf-circle-outline"
              size={34}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "add",
          tabBarIcon: ({ color }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              width: 56,
              borderRadius: 28,
              backgroundColor: Colors.light.tabIconSelected,
              marginBottom: 26
            }}>
              <FontAwesome6 name="add" size={28} color={'#fff'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="folder-open" size={28} color={color} />
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
