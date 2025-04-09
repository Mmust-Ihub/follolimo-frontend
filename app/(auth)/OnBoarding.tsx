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
            title: "Welcome To FOLOLIMO",
            subtitle:
              "FOLOLIMO is a comprehensive agricultural support platform designed to empower farmers by providing inventory and calender management, pest and disease management, soil property monitoring and crop suitability prediction to improve productivity and sustainability.",
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: "rgba(203, 203, 203, 0.7)",
            image: (
              <Image
                source={require("../../assets/img/inv.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Inventory Management and Farmer's Calendar",
            subtitle:
              "Keep track of your  farm, crops, and track progress with our inventory management system. Plan your farming activities with the farmer's calendar.",
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontWeight: "600",
    color: "#000",
    fontSize: 24,
  },
  subtitle: {
    color: "#333",
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default OnBoarding;
