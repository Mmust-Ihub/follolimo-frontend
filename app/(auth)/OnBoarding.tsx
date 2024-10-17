import React, { useContext, useEffect } from "react";
import { SafeAreaView, Image, StyleSheet, Alert } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { OnboardingContext } from "@/contexts/OnBoardingContext";
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

  if (isOnboardingCompleted && !userToken) {
    return <Login />;
  }

  const handleComplete = async () => {
    await completeOnboarding();
    // Alert.alert("Onboarding Complete", "Redirecting to login...");
    router.replace("/(auth)/Login");
  };

  if (isOnboardingCompleted) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        onSkip={handleComplete}
        onDone={handleComplete}
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
            title: "Real-Time Climate Data",
            subtitle:
              "Get accurate and timely weather insights to help you plan and protect your crops.",
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
            title: "Pest and Disease Management",
            subtitle:
              "Identify pests and diseases instantly with AI-powered image recognition.",
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
            title: "Soil Property Monitoring",
            subtitle:
              "Measure soil moisture, pH levels, and more with IoT devices for better crop management.",
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: "rgba(143, 200, 89, 0.8)",
            image: (
              <Image
                source={require("../../assets/img/crop.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Crop Suitability Prediction",
            subtitle:
              "Get recommendations on the best crops to grow based on your location and soil data.",
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
    fontWeight: "600", 
    color: "#000",
    fontSize: 24,
  },
  subtitle: {
    color: "#333",
    fontSize: 18,
  },
});

export default OnBoarding;
