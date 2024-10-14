import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import WeatherCard from "./WeatherCard";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { screenHeight } from "@/constants/AppDimensions";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
interface MyweatherProps {
  textColor: string;
}
export default function WeatherInfo({ textColor }: MyweatherProps) {
  const [farmData, setFarmData] = useState([]);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken } = authContext;
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch(
          `https://fololimo-api-eight.vercel.app/api/v1/insights/farms/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setFarmData(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchFarms();
  }, []);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {farmData?.length > 0 ? (
        farmData?.map(({ city }, index) => (
          <WeatherCard key={index} city={city} />
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
