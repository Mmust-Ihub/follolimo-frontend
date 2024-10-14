import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FarmCard from "./FarmCard";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";

interface MyFarmsProps {
  textColor: string;
}

export default function MyFarms({ textColor }: MyFarmsProps) {
  const [farmData, setFarmData] = useState([]);
  const router = useRouter();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken } = authContext;
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_DJANGOAPI_URL}/insights/farms/`,
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
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Farms</Text>
        <Pressable onPress={() => router.replace("/(tabs)/inventory/MyFarms")}>
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
        {farmData?.length > 0 ? (
          farmData?.map(({ name, location, city_name, size }, index) => (
            <FarmCard
              key={index}
              name={name}
              location={location}
              city_name={city_name}
              size={size}
              image={"https://picsum.photos/200/300"}
            />
          ))
        ) : (
          <View className="flex  items-center justify-center w-screen">
            <Text
              className="text-lg font-bold  text-center"
              style={{ color: textColor }}
            >
              No farms found...
            </Text>
            <Pressable onPress={() => router.replace("/(tabs)/add")}>
              <Text
                style={{
                  color: Colors.light.tabIconSelected,
                  textDecorationLine: "underline",
                }}
                className="text-lg font-bold  text-center"
              >
                Create one{" "}
              </Text>
            </Pressable>
          </View>
        )}
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
