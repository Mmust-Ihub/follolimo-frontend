import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { useLocalSearchParams, useNavigation, withLayoutContext } from "expo-router";
import React, { useContext, useEffect } from "react";
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
  const navigation = useNavigation();
  const { farmName } = useLocalSearchParams();


  useEffect(() => {
    navigation.setOptions({
      title: farmName,
    });
  }, [navigation]);
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint, 
        tabBarInactiveTintColor: themeColors.text,
        tabBarPressColor: Colors.lightGreen,
        tabBarIndicatorStyle: {
          backgroundColor: themeColors.tabIconSelected,
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          textTransform: "capitalize",
        },
      }}
    >
      <MaterialTopTabs.Screen options={{title: "My Spending"}}
        name="index"  />
      <MaterialTopTabs.Screen
        options={{ title: "My Calendars" }}
        name="Calendar"
      />
      <MaterialTopTabs.Screen options={{ title: "My Farms" }} name="farmdetail" />
    </MaterialTopTabs>
  );
};

export default Layout;
