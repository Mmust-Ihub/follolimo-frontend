import { useContext, useEffect } from "react";
import { router, Tabs } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "@/contexts/AuthContext"; // For user authentication
import { OnboardingContext } from "@/contexts/OnBoardingContext"; // For onboarding status
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  const authContext = useContext(AuthContext);
  const onboardingContext = useContext(OnboardingContext);

  if (!authContext || !onboardingContext) {
    throw new Error(
      "AuthContext and OnboardingContext must be used within their providers"
    );
  }

  const { userToken, isLoading: isAuthLoading } = authContext;
  const { isOnboardingCompleted, completeOnboarding } = onboardingContext;

  useEffect(() => {
    // Navigate to onboarding if not completed and user is not authenticated
    if (!isAuthLoading && !userToken && !isOnboardingCompleted) {
      console.log("Navigating to OnBoarding...");
      // router.replace("/(auth)/OnBoarding");
    }
    if (isOnboardingCompleted && !isAuthLoading && !userToken) {
      console.log("Navigating to Login...");
      router.replace("/(auth)/Login");
    }
  }, [isAuthLoading, userToken, isOnboardingCompleted]); // Depend on onboarding and auth states

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: Colors.light.tabIconSelected }}
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
          title: "Add",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 56,
                width: 56,
                borderRadius: 28,
                backgroundColor: Colors.light.tabIconSelected,
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
