import { useContext } from "react";
import { Tabs } from "expo-router";
import {
  View,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext"; // For user authentication
import { OnboardingContext } from "@/contexts/OnBoardingContext"; // For onboarding status
import { ThemeContext } from "@/contexts/ThemeContext"; // For theme management
import { Colors } from "@/constants/Colors"; // Custom color palette
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "react-native";
import OnBoarding from "../(auth)/OnBoarding";
import Login from "../(auth)/Login";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  const authContext = useContext(AuthContext);
  const onboardingContext = useContext(OnboardingContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !onboardingContext || !themeContext) {
    throw new Error(
      "AuthContext, OnboardingContext, and ThemeContext must be used within their providers"
    );
  }

  const { userToken, isLoading: isAuthLoading } = authContext;
  const { isOnboardingCompleted } = onboardingContext;
  const { isDarkMode } = themeContext;

  // Set theme-based colors
  const activeTintColor = isDarkMode
    ? Colors.dark.tabIconSelected
    : Colors.light.tabIconSelected;
  const inactiveTintColor = isDarkMode
    ? Colors.dark.tabIconDefault
    : Colors.light.tabIconDefault;
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const headerBackgroundColor = isDarkMode
    ? Colors.dark.headerBackground
    : Colors.light.headerBackground;
  const headerTextColor = isDarkMode
    ? Colors.dark.headerText
    : Colors.light.headerText;
  if (isAuthLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={activeTintColor} />
      </View>
    );
  }
  if (!userToken && !isOnboardingCompleted) {
    // setIsLoading(false);

    return <OnBoarding />;
    // router.replace("/(auth)/OnBoarding");
  }
  if (isOnboardingCompleted && !userToken) {
    return <Login />;
    // router.replace("/(auth)/Login");
  }
  console.log("backend urr  = " , process.env.EXPO_PUBLIC_BACKEND_URL)

  return (
    <>
      {/* StatusBar with dynamic theme */}
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={headerBackgroundColor}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeTintColor,
          tabBarInactiveTintColor: inactiveTintColor,
          tabBarStyle: { backgroundColor },
          headerStyle: { backgroundColor: headerBackgroundColor },
          headerTintColor: headerTextColor,
          tabBarLabelStyle: { fontSize: 12 },
        }}
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
            title: "Scan",
            tabBarBackground: () => (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 56,
                  backgroundColor: activeTintColor,
                }}  />
            ),
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="leaf-circle-outline"
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 56,
                  width: 56,
                  borderRadius: 28,
                  backgroundColor: activeTintColor,
                  marginBottom: 26,
                }}
              >
                <FontAwesome6 name="add" size={24} color={"#fff"} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="myfarms"
          
          options={{
            title: "My Farms",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="tractor" size={24} color={color} />
            ),
            headerLeft: () => (
              <Image
                style={styles.userImage}
                source={require("@/assets/images/splash-icon.png")}
              />
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
    </>
  );
}
const styles = StyleSheet.create({
  userImage: {
    width: 50,
    height: 50,
    left: 5,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0.6,
  },
});
