import React, { useContext, useEffect, useState } from "react";
import { screenHeight, screenWidth } from "@/constants/AppDimensions";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

type WeatherCardProps = {
  city: string;
  name: string;
  size: number;
};

type WeatherData = {
  temperature: number;
  description: string;
  city: string;
  humidity: number;
  min_temp: number;
  max_temp: number;
  pressure: number;
};

import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";

const WeatherCard = ({ city, name, size }: WeatherCardProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }

  const { userToken } = authContext;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/fololimo/weathers/${city}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.text}>{weatherData?.temperature} °C</Text>
        <Text style={styles.text}>Humidity: {weatherData?.humidity}%</Text>
        <Text style={styles.text}>{weatherData?.description}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={18} color="white" />
          <Text style={styles.text}>{city}, Kenya</Text>
        </View>
        <Text style={styles.text}>{size} acres</Text>
        <Text style={styles.text}>Soil pH: 6.5 (Neutral)</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="cloud" size={80} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.35,
    backgroundColor: Colors.darkGreen,
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden", // Ensures nothing spills outside the card
  },
  textContainer: {
    flex: 1,
    gap: 5,
    flexWrap: "wrap",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  text: {
    color: "white",
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.25,
  },
});

export default WeatherCard;
