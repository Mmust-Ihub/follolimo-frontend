import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthContext";

export default function Page() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [iotData, setIotData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;

  const { farmdet } = useGlobalSearchParams();
  const authContext = useContext(AuthContext);
  const { userToken, logout } = authContext || {};

  const fetchData = async () => {
    if (!farmdet) return;
    try {
      setRefreshing(true); // 👈 This triggers refresh indicator
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_NODEAPI_URL}/iot/data/${farmdet}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Farm Data:", data);
        setSuggestions(data?.data?.suggestion);
        setIotData(data?.iotData);
      } else if (res.status === 401) {
        logout?.();
      }
    } catch (error) {
      console.error("Error fetching farm data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // 👈 Stop the refresh indicator
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "Farm Details" });

    const interval = setInterval(() => {
      fetchData();
    }, 10000); // 30 seconds

    return () => clearInterval(interval);
  }, [farmdet]);

  const renderProgressBar = (value: number) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: color.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchData}
          tintColor={color.text}
        />
      }
    >
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      ) : (
        <>
          {/* IoT Soil Data */}
          {iotData && (
            <View style={[styles.card, { backgroundColor: color.cardBg }]}>
              <Text style={[styles.title, { color: color.text }]}>
                Soil Data
              </Text>

              {/* Moisture */}
              <Text style={[styles.label, { color: color.text }]}>
                Moisture: <Text style={styles.value}>{iotData.moisture}%</Text>
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${iotData.moisture}%`,
                      backgroundColor: "#0ea5e9",
                    },
                  ]}
                />
              </View>

              {/* pH with color-coded interpretation */}
              <Text style={[styles.label, { color: color.text }]}>
                pH: <Text style={styles.value}>{iotData.ph}</Text>
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(iotData.ph / 14) * 100}%`,
                      backgroundColor:
                        iotData.ph < 6
                          ? "#ef4444"
                          : iotData.ph <= 7.5
                          ? "#22c55e"
                          : "#3b82f6",
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      iotData.ph < 6
                        ? "#ef4444"
                        : iotData.ph <= 7.5
                        ? "#22c55e"
                        : "#3b82f6",
                    fontStyle: "italic",
                    marginBottom: 12,
                  },
                ]}
              >
                {iotData.ph < 6
                  ? "Soil is acidic — consider lime."
                  : iotData.ph <= 7.5
                  ? "Soil is neutral — ideal for most crops."
                  : "Soil is alkaline — add organic matter."}
              </Text>

              {/* Nitrogen */}
              <Text style={[styles.label, { color: color.text }]}>
                Nitrogen: <Text style={styles.value}>{iotData.nitrogen}</Text>
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${iotData.nitrogen}%`,
                      backgroundColor: "#a855f7",
                    },
                  ]}
                />
              </View>

              {/* Phosphorus */}
              <Text style={[styles.label, { color: color.text }]}>
                Phosphorus:{" "}
                <Text style={styles.value}>{iotData.phosphorus}</Text>
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${iotData.phosphorus}%`,
                      backgroundColor: "#facc15",
                    },
                  ]}
                />
              </View>

              {/* Potassium */}
              <Text style={[styles.label, { color: color.text }]}>
                Potassium: <Text style={styles.value}>{iotData.potassium}</Text>
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${iotData.potassium}%`,
                      backgroundColor: "#10b981",
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Crop Suitability Suggestions */}
          <Text style={[styles.title, { color: color.text }]}>
            Crop Suggestions
          </Text>
          {suggestions?.map((crop, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: color.cardBg }]}
            >
              <Text style={[styles.subtitle, { color: color.text }]}>
                Crop: {crop.name}
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                Suitability Score: {crop.suitabilityScore}%
              </Text>
              {renderProgressBar(crop.suitabilityScore)}
              <Text style={[styles.label, { color: color.text, marginTop: 8 }]}>
                Description:
              </Text>
              <Text style={[styles.value, { color: color.text }]}>
                {crop.suitability}
              </Text>

              <Text style={[styles.label, { color: color.text, marginTop: 8 }]}>
                Recommendations:
              </Text>
              <Text style={[styles.value, { color: color.text }]}>
                {crop.additions}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 8,

    // overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",

    borderRadius: 5,
  },
  progressBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});
