import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type Farm = {
  name: string;
  city_name: string;
  location: string;
  size: number;
  image: string;
};
export default function FarmCard({
  name,
  location,
  city_name,
  image,
  size,
}: Farm) {

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <View style={styles.name}>
        <Text className="font-bold text-lg">{name}</Text>
        <Text className="font-bold">{size} acres</Text>
      </View>
      <View style={styles.location}>
        <Ionicons name="location-sharp" size={16} color="gray" />
        <Text className="flex items-center justify-center text-center">
          {location}, {city_name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: Colors.lightGreen,
    margin: 10,
    padding: 10,
  },
  image: {
    width: 180,
    height: 120,
    borderRadius: 10,
  },
  name: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    fontSize: 14,
    marginTop: 5,
    color: "gray",
    alignItems: "center",
  },
});
