import React, { useContext } from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { OnboardingContext } from "@/contexts/OnBoardingContext";
import { router } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import Login from "./Login";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface PageData {
  image: number;
  title: string;
  subtitle: string;
}

const pagesData: PageData[] = [
  {
    image: require("../../assets/img/harvest.jpg"),
    title: "Welcome To FOLOLIMO",
    subtitle:
      "Empowering farmers with inventory, calendar, pest management, soil monitoring, and crop prediction.",
  },
  {
    image: require("../../assets/img/inv.jpg"),
    title: "Inventory & Calendar",
    subtitle:
      "Track your crops, progress, and activities seamlessly with our smart system.",
  },
  {
    image: require("../../assets/img/bug.jpg"),
    title: "Pest & Disease Management",
    subtitle: "Detect pests and diseases instantly with AI vision.",
  },
  {
    image: require("../../assets/img/iot.jpg"),
    title: "Soil Property Monitoring",
    subtitle: "Measure moisture, pH, and more using IoT sensors.",
  },
  {
    image: require("../../assets/img/crop.jpg"),
    title: "Crop Suitability Prediction",
    subtitle: "Get data-driven crop recommendations based on your farm.",
  },
];

const OnBoarding: React.FC = () => {
  const authContext = useContext(AuthContext);
  const onboardingContext = useContext(OnboardingContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !onboardingContext || !themeContext) {
    throw new Error("All contexts must be provided");
  }

  const { userToken } = authContext;
  const { isOnboardingCompleted, completeOnboarding } = onboardingContext;

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/(auth)/Login");
  };

  if (isOnboardingCompleted && !userToken) {
    return <Login />;
  }

  if (isOnboardingCompleted) {
    return null;
  }

  const pulse = useSharedValue(1);
  pulse.value = withRepeat(withTiming(1.2, { duration: 800 }), -1, true);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const themedPages = pagesData.map((page) => ({
    backgroundColor: "#000",
    image: (
      <ImageBackground
        source={page.image}
        style={styles.bgImage}
        imageStyle={styles.bgImageStyle}
      >
        <View style={styles.overlay} />
        <BlurView intensity={70} tint="dark" style={styles.textContainer}>
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.subtitle}>{page.subtitle}</Text>
        </BlurView>
      </ImageBackground>
    ),
    title: "",
    subtitle: "",
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Onboarding
        onSkip={handleComplete}
        onDone={handleComplete}
        pages={themedPages}
        containerStyles={{ backgroundColor: "#000" }}
        titleStyles={{ display: "none" }}
        subTitleStyles={{ display: "none" }}
        bottomBarHighlight={false}
        imageContainerStyles={{ flex: 1, padding: 0, margin: 0 }}
        controlStatusBar={false}
        showNext
        showDone
        showSkip
        DotComponent={({ selected }: { selected: boolean }) => (
          <View
            style={[
              styles.dot,
              { backgroundColor: selected ? "#fff" : "rgba(255,255,255,0.4)" },
            ]}
          />
        )}
        NextButtonComponent={({ ...props }) => (
          <Animated.View style={pulseStyle}>
            <TouchableOpacity
              style={styles.button}
              {...props} // Pass press handler and accessibility
            >
              <Text style={styles.buttonText}>Next →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        DoneButtonComponent={({ ...props }) => (
          <Animated.View style={pulseStyle}>
            <TouchableOpacity
              style={styles.button}
              {...props}
              onPress={handleComplete}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        SkipButtonComponent={({ ...props }) => (
          <TouchableOpacity
            style={styles.skipButton}
            {...props}
            onPress={handleComplete}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  bgImageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textContainer: {
    width: "90%",
    marginBottom: 120,
    padding: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    lineHeight: 26,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: "#00c851",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  skipButton: {
    marginLeft: 12,
    backgroundColor: "gray",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    color: "#eee",
    fontSize: 16,
  },
});

export default OnBoarding;
