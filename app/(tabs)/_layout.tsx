import { useContext, useEffect } from "react";
import { router, Tabs } from "expo-router";
import { View, ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { AuthContext } from "@/contexts/AuthContext"; // For user authentication
import { OnboardingContext } from "@/contexts/OnBoardingContext"; // For onboarding status
import { ThemeContext } from "@/contexts/ThemeContext"; // For theme management
import { Colors } from "@/constants/Colors"; // Custom color palette
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "react-native";

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

  useEffect(() => {
    // Navigate to onboarding if not completed and user is not authenticated
    if (!isAuthLoading && !userToken && !isOnboardingCompleted) {
      console.log("Navigating to OnBoarding...");
      router.replace("/(auth)/OnBoarding");
    }
    if (isOnboardingCompleted && !isAuthLoading && !userToken) {
      console.log("Navigating to Login...");
      router.replace("/(auth)/Login");
    }
  }, [isAuthLoading, userToken, isOnboardingCompleted]);

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
                <FontAwesome6 name="add" size={28} color={"#fff"} />
              </View>
            ),
          }}
        />
        <Tabs.Screen

          name="inventory"
          options={{
            headerTitle: "My inventory",
            
            tabBarIcon: ({ color }) => (
              <FontAwesome name="folder-open" size={28} color={color} />
            ),
            headerLeft: () => (
              <Image
                style={styles.userImage}
                source={require("@/assets/images/splash.png")}
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
