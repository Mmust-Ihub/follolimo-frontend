import React, { useContext } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

const Layout = () => {
  const { id, farmName } = useLocalSearchParams();
  const farmNameString = Array.isArray(farmName) ? farmName[0] : farmName;
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;

  return (
    <Stack screenOptions={{ title: farmNameString }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Farms",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
          },

          headerTitleAlign: "center",
          // backgroundColor: "#fff",
          headerStyle: {
            backgroundColor: isDarkMode
              ? Colors.dark.background
              : Colors.light.background,
          },
        }}
      />
      <Stack.Screen name="[farmdet]" options={{ animation: "flip" }} />
    </Stack>
  );
};

export default Layout;
