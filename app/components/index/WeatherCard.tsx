import React, { useContext, useEffect, useState } from "react";
import { screenHeight, screenWidth } from "@/constants/AppDimensions";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

type WeatherCardProps = {
  city: string;
};
type WeatherData = {
  temperature: number;
  description: String;
  city: String;
  humidity: number;
  min_temp: number;
  max_temp: number;
  pressure: number;
};
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
const WeatherCard = ({ city }: WeatherCardProps) => {
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
          `https://fololimo-api-eight.vercel.app/api/v1/fololimo/weathers/${city}/`,
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
        console.error("Error fetching regions:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View className="gap-4">
        <Text className="text-white ">{weatherData?.temperature} °C</Text>
        <Text className="text-white ">Humidity {weatherData?.humidity}%</Text>
        <Text className="text-white font-semibold capitalize">
          {weatherData?.description}
        </Text>
        <Text className="text-white ">
          <Ionicons name="location-sharp" size={24} color="white" />{" "}
          {weatherData?.city}, Kenya
        </Text>
        <Text className="text-white ">Soil p.H 6.5 (Neutral)</Text>
      </View>
      <View className="justify-center items-center">
        <Ionicons name="cloud" size={80} color="white" />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
    backgroundColor: Colors.darkGreen,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
export default WeatherCard;
