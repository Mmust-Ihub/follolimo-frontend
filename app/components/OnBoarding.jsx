import { SafeAreaView, Image, StyleSheet } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";

const OnBoarding = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        pages={[
          {
            backgroundColor: "rgba(197, 131, 67, 0.8)", // Light background with some transparency
            image: (
              <Image
                source={require("../../assets/img/harvest.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Onboarding",
            subtitle: "Done with React Native Onboarding Swiper",
            titleStyle: styles.title,
            subtitleStyle: styles.subtitle,
          },
          {
            backgroundColor: "rgba(62, 104, 34, 0.9)", // Dark green background with transparency
            image: (
              <Image
                source={require("../../assets/img/bug.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "The Title",
            subtitle: "This is the subtitle that supplements the title.",
            titleStyle: styles.title,
            subtitleStyle: styles.subtitle,
          },
          {
            backgroundColor: "rgba(203, 203, 203, 0.7)", // Gray background with transparency
            image: (
              <Image
                source={require("../../assets/img/iot.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Triangle",
            subtitle: "Beautiful, isn't it?",
            titleStyle: styles.title,
            subtitleStyle: styles.subtitle,
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
    width: "100%", // Full width
    height: 300, // Set a height
    resizeMode: "contain", // Maintain aspect ratio
   // Add border radius for rounded corners
    overflow: "hidden", // Ensure corners are clipped properly
  },
  title: {
    color: "#000", // Title color for better visibility
    fontSize: 24, // Adjust font size if needed
  },
  subtitle: {
    color: "#555", // Subtitle color for better visibility
    fontSize: 16, // Adjust font size if needed
  },
});

export default OnBoarding;
