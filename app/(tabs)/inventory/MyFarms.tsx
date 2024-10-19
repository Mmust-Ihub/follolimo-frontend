import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";
import { screenHeight } from "@/constants/AppDimensions";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type Farm = {
  id: number;
  name: string;
  location: string;
  city: number;
  city_name: string;
  size: number; // Size in acres
  latitude?: number | null; // Optional property
  longitude?: number | null; // Optional property
};

export default function Page() {
  const [farmData, setFarmData] = useState<Array<Farm> | null>();
  const [refreshing, setRefreshing] = useState(false);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }

  const { userToken } = authContext;

  const fetchFarms = async () => {
    try {
      setRefreshing(true);
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
      console.log(data);
    } catch (error) {
      console.error("Error fetching regions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        style={{ backgroundColor }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchFarms()}
            tintColor={Colors.light.tabIconSelected}
          />
        }
      >
        <View>
          <Text
            style={[
              styles.MyFarmsTitle,
              { color: currentColors.tabIconSelected },
            ]}
          >
            My Farms' Details
          </Text>
        </View>
        <View>
          {farmData && farmData.length > 0 ? (
            farmData?.map((farm: Farm, index) => (
              <View
                key={index}
                style={[styles.Card, { backgroundColor: currentColors.cardBg }]}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: currentColors.text,
                    },
                  ]}
                >
                  {farm.name}
                </Text>
                <View>
                  <Text style={{ color: currentColors.text }}>
                    Location: {farm.location}
                  </Text>
                  <Text style={{ color: currentColors.text }}>
                    City: {farm.city_name}
                  </Text>
                  <Text style={{ color: currentColors.text }}>
                    Size: {farm.size} acres
                  </Text>
                  <Text style={{ color: currentColors.text }}>
                    farmid: {farm.id}
                  </Text>
                  <Link
                    href={`/tabs/farms/${farm?.id}`}
                    style={{
                      color: currentColors.tabIconSelected,
                      textDecorationLine: "underline",
                    }}
                  >
                    View Details
                  </Link>
                </View>
              </View>
            ))
          ) : (
            <View>
              <Text style={{ color: currentColors.tabIconSelected }}>
                No farms Data found... Pull down to refresh {"\n"} or
              </Text>

              <Link
                href="/(tabs)/add"
                style={{
                  textDecorationLine: "underline",
                  color: currentColors.tabIconSelected,
                }}
              >
                Create your farm
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MyFarmsTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollViewStyle: {
    padding: 20,
    minHeight: screenHeight,
  },
  Card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "stretch",
  },
  innerCardText: {
    color: "white",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textDecorationColor: Colors.light.tabIconSelected,
  },
});
