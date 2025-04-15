import React, { useEffect } from "react";
import { ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { useFetch } from "@/contexts/usefetchData";
import WeatherCard from "./WeatherCard";
import ShimmerPlaceholder from "react-native-shimmer-placeholder"; // Import the shimmer placeholder
import { Colors } from "@/constants/Colors";
import { screenHeight, screenWidth } from "@/constants/AppDimensions";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface MyweatherProps {
  textColor: string;
}

export default function WeatherInfo({ textColor }: MyweatherProps) {
  const { farmData, fetchFarms, loading } = useFetch();
  // console.log("farm details data", farmData);

  useEffect(() => {
    fetchFarms();
  }, []);

  // Number of shimmer placeholders to display while loading
  const shimmerPlaceholders = Array.from({ length: 3 });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      contentContainerStyle={styles.container}
    >
      {loading ? (
        // Display shimmer placeholders during loading
        <View style={styles.shimmerContainer}>
          {shimmerPlaceholders.map((_, index) => (
            <View key={index} style={styles.shimmerCard}>
              <ShimmerPlaceholder
                style={styles.shimmer}
                shimmerColors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
                LinearGradient={LinearGradient}
              />
            </View>
          ))}
        </View>
      ) : farmData?.length > 0 ? (
        farmData?.map(
          (
            { description, farm, humidity, location, temperature, farmId },
            index
          ) => (
            <WeatherCard
              key={index}
              location={location}
              farm={farm}
              description={description}
              humidity={humidity}
              temperature={temperature}
              farmId={farmId}
            />
          )
        )
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: textColor }]}>
            No farms Data found...
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/add")}
            style={{
              backgroundColor: "#22c55e",
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
              width: screenWidth * 0.8,
            }}
          >
            <Text
              style={{
                color: "white",
              }}
              className="text-lg font-bold text-center"
            >
              Create a farm{" "}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  shimmerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shimmerCard: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.35,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  shimmerText: {
    width: "60%",
    height: 20,
    marginTop: 10,
    borderRadius: 5,
  },
  noDataContainer: {
    flex: 1,
    width: screenWidth,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 2,
  },
});
