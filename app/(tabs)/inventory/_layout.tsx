import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import React, { useContext } from "react";
import { Stack } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext"; // Import ThemeContext

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const Layout = () => {
  const themeContext = useContext(ThemeContext); // Access the theme context
  const isDarkMode = themeContext?.isDarkMode || false; // Get current theme
  const themeColors = isDarkMode ? Colors.dark : Colors.light; // Use theme colors based on mode

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint, // Dynamic active tab text color
        tabBarInactiveTintColor: themeColors.text, // Dynamic inactive tab text color
        tabBarStyle: {
          backgroundColor: themeColors.background, // Dynamic background color
        },
        tabBarIndicatorStyle: {
          backgroundColor: themeColors.tabIconSelected, // Dynamic indicator color
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          textTransform: "capitalize",
        },
      }}
    >
      <MaterialTopTabs.Screen options={{ title: "My Spending" }} name="index" />
      <MaterialTopTabs.Screen
        options={{ title: "My Calendars" }}
        name="Calendar"
      />
      <MaterialTopTabs.Screen options={{ title: "My Farms" }} name="MyFarms" />
    </MaterialTopTabs>
  );
};

export default Layout;
