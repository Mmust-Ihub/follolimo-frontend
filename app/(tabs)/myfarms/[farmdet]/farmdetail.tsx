import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

export default function Page() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [iotData, setIotData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    navigation.setOptions({ title: "Farm Suitability Report" });

    // Simulate data fetching
    const fetchData = async () => {
      try {
        const response = {
          data: {
            suggestion: [
              {
                name: "Potatoes",
                suitability: "Potatoes thrive in Nakuru's climate...",
                suitabilityScore: 85,
                additions:
                  "Consider supplementing phosphorus levels in the soil for optimal yields.",
              },
              {
                name: "Wheat",
                suitability: "Wheat is well-suited to the soil conditions...",
                suitabilityScore: 80,
                additions:
                  "Ensure adequate irrigation during dry spells to maintain consistent yields.",
              },
              // ... more crops
            ],
          },
          iotData: {
            moisture: 15,
            nitrogen: 1.2,
            phosphorus: 0.8,
            potassium: 2.3,
            ph: 6.5,
          },
        };

        setSuggestions(response.data.suggestion);
        setIotData(response.iotData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching farm data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderProgressBar = (value: number) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
      <Text style={styles.progressBarText}>{value}%</Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: color.background }]}
    >
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      ) : (
        <>
          {/* IoT Soil Data */}
          {iotData && (
            <View style={[styles.card, { backgroundColor: color.cardBg }]}>
              <Text style={[styles.title, { color: color.text }]}>
                Soil IOT Data
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                Moisture: <Text style={styles.value}>{iotData.moisture}%</Text>
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                pH: <Text style={styles.value}>{iotData.ph}</Text>
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                Nitrogen: <Text style={styles.value}>{iotData.nitrogen}</Text>
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                Phosphorus:{" "}
                <Text style={styles.value}>{iotData.phosphorus}</Text>
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                Potassium: <Text style={styles.value}>{iotData.potassium}</Text>
              </Text>
            </View>
          )}

          {/* Crop Suitability Suggestions */}
          <Text style={[styles.title, { color: color.text }]}>
            Crop Suggestions
          </Text>
          {suggestions.map((crop, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: color.cardBg }]}
            >
              <Text style={[styles.subtitle, { color: color.text }]}>
                Crop: {crop.name}
              </Text>
              <Text style={[styles.label, { color: color.text }]}>
                Suitability Score:
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
    fontWeight: "600",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
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
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});
