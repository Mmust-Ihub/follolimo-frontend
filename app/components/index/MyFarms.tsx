import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import FarmCard from "./FarmCard";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface MyFarmsProps {
  textColor: string;
}

export default function MyFarms({ textColor }: MyFarmsProps) {
  const router = useRouter()
  const farms = [
    {
      name: "Farm 1",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 2",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 3",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 4",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 5",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
  ];

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Farms</Text>
        <Pressable onPress={() => router.replace('/(tabs)/inventory/MyFarms')}>
          <Text
            style={{
              color: Colors.light.tabIconSelected,
              textDecorationLine: "underline",
            }}
          >
            View all
          </Text>
        </Pressable>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {farms.map((farm, index) => (
          <FarmCard key={index} {...farm} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
});
