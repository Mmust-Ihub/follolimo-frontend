import React, { useEffect } from "react";
import { ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { useFetch } from "@/contexts/usefetchData";
import WeatherCard from "./WeatherCard";
import ShimmerPlaceholder from "react-native-shimmer-placeholder"; // Import the shimmer placeholder
import { Colors } from "@/constants/Colors";
import { screenHeight } from "@/constants/AppDimensions";
import { router } from "expo-router";

interface MyweatherProps {
  textColor: string;
}

export default function WeatherInfo({ textColor }: MyweatherProps) {
  const { farmData, fetchFarms, loading } = useFetch();
  

  useEffect(() => {
    fetchFarms();
  }, []);

  // Number of shimmer placeholders to display while loading
  const shimmerPlaceholders = Array.from({ length: 3 });

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {loading ? (
        // Display shimmer placeholders during loading
        <View style={styles.shimmerContainer}>
          {shimmerPlaceholders.map((_, index) => (
            <View key={index} style={styles.shimmerCard}>
              <ShimmerPlaceholder
                style={styles.shimmer}
                shimmerColors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
              />
              {/* <ShimmerPlaceholder
                style={styles.shimmerText}
                shimmerColors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
              /> */}
            </View>
          ))}
        </View>
      ) : farmData?.length > 0 ? (
        farmData?.map(({ location, name,size }, index) => (
          <WeatherCard key={index} city={location} name={name} size={size}/>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: textColor }]}>
            No farms Data found...
          </Text>
          <Pressable onPress={() => router.replace("/(tabs)/add")}>
            <Text
              style={{
                color: Colors.light.tabIconSelected,
                textDecorationLine: "underline",
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
    height: screenHeight * 0.35,
    gap: 10,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  shimmerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shimmerCard: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "70%",
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
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
