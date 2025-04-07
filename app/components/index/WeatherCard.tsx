import { screenHeight, screenWidth } from "@/constants/AppDimensions";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";



type WeatherData = {
  farmId: string;
  location: string;
  farm: string;
  temperature: number;
  description: string;
  humidity: number;
  // min_temp: number;
  // pressure: number;
};

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WeatherCard = ({
  location,
  farmId,
  farm,
  description,
  humidity,
  temperature,
}: WeatherData) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/myfarms/[farmdet]/farmdetail",
          params: { id: farmId, farmName: farm },
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{farm}</Text>
          <Text style={styles.text}>Temperature: {temperature} °C</Text>
          <Text style={styles.text}>Humidity: {humidity}%</Text>
          <Text style={styles.text}>Description: {description}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={18} color="white" />
            <Text style={styles.text}>{location}, Kenya</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud" size={110} color="white" />
        </View>
      </View>
    </TouchableOpacity>
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
    gap: 14,
    flexWrap: "wrap",
  },
  title: {
    color: "white",
    fontSize: 20,
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
    // width: screenWidth * 0.35,
  },
});

export default WeatherCard;
