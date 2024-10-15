import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import WeatherCard from "./WeatherCard";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { screenHeight } from "@/constants/AppDimensions";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useFetch } from "@/contexts/usefetchData";
interface MyweatherProps {
  textColor: string;
}
export default function WeatherInfo({ textColor }: MyweatherProps) {
  const { farmData, fetchWeather, loading, fetchFarms } = useFetch();
  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {loading ? (
        <View className="w-screen flex flex-col justify-center items-center">
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text
            style={{ color: textColor }}
            className="text-lg mt-4 w-full text-center"
          >
            Loading...
          </Text>
        </View>
      ) : farmData?.length > 0 ? (
        farmData?.map(({ city, name }, index) => (
          <WeatherCard key={index} city={city} name={name} />
        ))
      ) : (
        <View className="flex  items-center justify-center w-screen">
          <Text
            className="text-lg font-bold  text-center"
            style={{ color: textColor }}
          >
            No farms Data found...
          </Text>
          <Pressable onPress={() => router.replace("/(tabs)/add")}>
            <Text
              style={{
                color: Colors.light.tabIconSelected,
                textDecorationLine: "underline",
              }}
              className="text-lg font-bold  text-center"
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
    height: screenHeight * 0.3,
    gap: 10,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
});
