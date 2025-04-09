import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { FarmData } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";

type Bardata = {
  label: string;
  value: number;
};

export default function Page() {
  const navigation = useNavigation();
  const { farmdet: id } = useLocalSearchParams();
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [loading, setLoading] = useState(true);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    navigation.setOptions({ title: "Farm Details" });

    const unsubscribe = onSnapshot(collection(db, "fololimo"), (snapshot) => {
      const matchedFarms = snapshot.docs
        .filter((doc) => doc.data().farm_id === id)
        .map((doc) => doc.data() as FarmData);

      if (matchedFarms.length > 0) {
        console.log("Farm data:", matchedFarms[0]);
        setFarmData(matchedFarms[0]);
      } else {
        setFarmData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, navigation]);

  const renderProgressBar = (value: number) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
      <Text style={styles.progressBarText}>{value}%</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      ) : farmData ? (
        <View style={styles.dataContainer}>
          {/* Farm Basic Info */}
          <View style={[styles.card, { backgroundColor: color.cardBg }]}>
            <Text style={[styles.title, { color: color.text }]}>Farm Details</Text>
            <View style={styles.infoContainer}>
              <Text style={[styles.label, { color: color.text }]}>Farm ID:</Text>
              <Text style={[styles.value, { color: color.text }]}>
                {farmData.farm_id}
              </Text>
            </View>

            {/* Soil Info */}
            {farmData.soil_data && (
              <>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Soil Moisture:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {farmData.soil_data.Moisture}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Soil pH:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {farmData.soil_data.pH}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Soil NPK:</Text>
                  <View style={styles.npkContainer}>
                    <View style={styles.npkBox}>
                      <Text style={styles.npkLabel}>N</Text>
                      <Text style={styles.npkValue}>
                        {farmData.soil_data.NPK?.Nitrogen}
                      </Text>
                    </View>
                    <View style={styles.npkBox}>
                      <Text style={styles.npkLabel}>P</Text>
                      <Text style={styles.npkValue}>
                        {farmData.soil_data.NPK?.Phosphorus}
                      </Text>
                    </View>
                    <View style={styles.npkBox}>
                      <Text style={styles.npkLabel}>K</Text>
                      <Text style={styles.npkValue}>
                        {farmData.soil_data.NPK?.Potassium}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Crops for 3 Months */}
          {Array.isArray(farmData.crops_for_3_months) &&
            farmData.crops_for_3_months.map((crop, index) => (
              <View key={index} style={[styles.card, { backgroundColor: color.cardBg }]}>
                <Text style={styles.subtitle}>Crop: {crop.crop_name}</Text>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Suitability Score:</Text>
                  {renderProgressBar(crop.suitability_score)}
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Expected Yield:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {crop.expected_yield_per_hectare} per hectare
                  </Text>
                </View>
                <Text style={styles.recommendationTitle}>Recommendations:</Text>
                <View style={styles.recommendationContainer}>
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationLabel}>Nitrogen:</Text>
                    <Text style={styles.recommendationValue}>
                      {crop.recommendations?.fertilizer?.nitrogen}
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationLabel}>Phosphorus:</Text>
                    <Text style={styles.recommendationValue}>
                      {crop.recommendations?.fertilizer?.phosphorus}
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationLabel}>Potassium:</Text>
                    <Text style={styles.recommendationValue}>
                      {crop.recommendations?.fertilizer?.potassium}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Irrigation:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {crop.recommendations?.irrigation}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>pH Adjustment:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {crop.recommendations?.pH_adjustment}
                  </Text>
                </View>
              </View>
            ))}

          {/* Crops for 6 Months */}
          {Array.isArray(farmData.crops_for_6_months) &&
            farmData.crops_for_6_months.map((crop, index) => (
              <View key={index} style={[styles.card, { backgroundColor: color.cardBg }]}>
                <Text style={styles.subtitle}>Crop: {crop.crop_name}</Text>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Suitability Score:</Text>
                  {renderProgressBar(crop.suitability_score)}
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Expected Yield:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {crop.expected_yield_per_hectare} per hectare
                  </Text>
                </View>
                <Text style={styles.recommendationTitle}>Recommendations:</Text>
                <View style={styles.recommendationContainer}>
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationLabel}>Nitrogen:</Text>
                    <Text style={styles.recommendationValue}>
                      {crop.recommendations?.fertilizer?.nitrogen}
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationLabel}>Phosphorus:</Text>
                    <Text style={styles.recommendationValue}>
                      {crop.recommendations?.fertilizer?.phosphorus}
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <Text style={styles.recommendationLabel}>Potassium:</Text>
                    <Text style={styles.recommendationValue}>
                      {crop.recommendations?.fertilizer?.potassium}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>Irrigation:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {crop.recommendations?.irrigation}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>pH Adjustment:</Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {crop.recommendations?.pH_adjustment}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.noData}>No farm data available.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  dataContainer: { marginBottom: 20 },
  card: { borderRadius: 8, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "bold" },
  value: { fontSize: 14 },
  infoContainer: { marginBottom: 8 },
  recommendationTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  recommendationContainer: { marginTop: 4 },
  recommendationItem: { flexDirection: "row", justifyContent: "space-between" },
  recommendationLabel: { fontSize: 14, fontWeight: "500" },
  recommendationValue: { fontSize: 14 },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#4caf50",
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
  },
  progressBarText: { fontSize: 12, fontWeight: "500" },
  npkContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  npkBox: { alignItems: "center", flex: 1 },
  npkLabel: { fontWeight: "bold", fontSize: 12 },
  npkValue: { fontSize: 12 },
  noData: { fontSize: 16, fontStyle: "italic", textAlign: "center", marginTop: 20 },
});
