import React, { useEffect } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder"; // Import shimmer placeholder
import FarmCard from "./FarmCard";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useFetch } from "@/contexts/usefetchData";


interface MyFarmsProps {
  textColor: string;
}

export default function MyFarms({ textColor }: MyFarmsProps) {
  const router = useRouter();
  

  const { farmData, loading, fetchFarms } = useFetch();

  useEffect(() => {
    fetchFarms();
  }, []);

  // Number of shimmer placeholders to display while loading
  const shimmerPlaceholders = Array.from({ length: 3 });

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Farms</Text>
        {farmData && (
          <Pressable
            onPress={() => router.replace("/(tabs)/myfarms")}
          >
            <Text
              style={{
                color: Colors.light.tabIconSelected,
                textDecorationLine: "underline",
              }}
            >
              View all
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {loading ? (
          // Shimmer placeholders during loading
          shimmerPlaceholders.map((_, index) => (
            <View key={index} style={styles.shimmerCard}>
              <ShimmerPlaceholder
                style={styles.shimmer}
                shimmerColors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
              />
              <ShimmerPlaceholder
                style={styles.shimmerText}
                shimmerColors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
              />
            </View>
          ))
        ) : farmData?.length > 0 ? (
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
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { color: textColor }]}>
              No farms found...
            </Text>
            <Pressable onPress={() => router.replace("/(tabs)/add")}>
              <Text
                style={{
                  color: Colors.light.tabIconSelected,
                  textDecorationLine: "underline",
                }}
                className="text-lg font-bold text-center"
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
