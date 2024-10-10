import { Platform, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import { screenHeight } from '@/constants/AppDimensions';
import { Colors } from '@/constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function WeatherInfo() {
  return (
    <View style={styles.container}>
      <View className='gap-4'>
        <Text className="text-white ">32°C</Text>
        <Text className="text-white ">Chances of rain 60%</Text>
        <Text className="text-white font-semibold">Partly Cloudy</Text>
        <Text className="text-white ">
          <Ionicons name="location-sharp" size={24} color="white" /> Nairobi,
          Kenya
        </Text>
        <Text className="text-white ">Soil p.H 6.5 (Neutral)</Text>
      </View>
      <View className='justify-center items-center'>
        <Ionicons name="cloud" size={80} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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