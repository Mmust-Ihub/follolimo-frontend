// OnBoarding.js
import React, { useContext, useEffect } from "react";
import { SafeAreaView, Image, StyleSheet, Alert } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { OnboardingContext } from "@/contexts/OnBoardingContext"; // Import the context
import { router } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import Login from "./Login";

const OnBoarding = () => {
  const authContext = useContext(AuthContext);
  const onboardingContext = useContext(OnboardingContext);

  if (!authContext || !onboardingContext) {
    throw new Error(
      "AuthContext and OnboardingContext must be used within their providers"
    );
  }
  const { userToken, isLoading: isAuthLoading } = authContext;
  const { isOnboardingCompleted, completeOnboarding } = onboardingContext;

  // useEffect(() => {
  if (isOnboardingCompleted && !userToken) {
    return <Login />;
    // router.replace("/(auth)/Login"); // Redirect to login if onboarding was completed
  }
  // }, [isOnboardingCompleted, isAuthLoading, userToken]);

  const handleComplete = async () => {
    await completeOnboarding(); // Mark onboarding as complete in context
    Alert.alert("Onboarding Complete", "Redirecting to login...");
    router.replace("/(auth)/Login"); // Redirect to login
  };

  if (isOnboardingCompleted) {
    return null; // Prevent showing the onboarding screen if already completed
  }
  console.log("Onboarding", isOnboardingCompleted);
  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        onSkip={handleComplete} // Handle skip action
        onDone={handleComplete} // Handle completion action
        pages={[
          {
            backgroundColor: "rgba(197, 131, 67, 0.8)",
            image: (
              <Image
                source={require("../../assets/img/harvest.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Onboarding",
            subtitle: "Done with React Native Onboarding Swiper",
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: "rgba(62, 104, 34, 0.9)",
            image: (
              <Image
                source={require("../../assets/img/bug.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "The Title",
            subtitle: "This is the subtitle that supplements the title.",
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: "rgba(203, 203, 203, 0.7)",
            image: (
              <Image
                source={require("../../assets/img/iot.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Triangle",
            subtitle: "Beautiful, isn’t it?",
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    overflow: "hidden",
  },
  title: {
    color: "#000",
    fontSize: 24,
  },
  subtitle: {
    color: "#555",
    fontSize: 16,
  },
});

export default OnBoarding;
