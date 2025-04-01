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
// import { BarChart } from "react-native-gifted-charts";
import { Colors } from "@/constants/Colors";
// import { title } from "process";
import { ThemeContext } from "@/contexts/ThemeContext";

type Bardata = {
  label: string;
  value: number;
};

export default function Page() {
  const navigation = useNavigation();
  const id  = useLocalSearchParams().farmdet as string;
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [barChartData3Months, setBarChartData3Months] = useState<Bardata[]>([]);
  const [barChartData6Months, setBarChartData6Months] = useState<Bardata[]>([]);
  const [loading, setLoading] = useState(true);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;
  useEffect(() => {
    navigation.setOptions({
      title: `Farm Details`,
    });
    const fetchData = () => {
      const query = collection(db, "fololimo");

      const unsubscribe = onSnapshot(query, (snapshot) => {
        const cropData: FarmData[] = snapshot.docs
          .filter((doc) => doc.data().farm_id == id)
          .map((doc) => doc.data() as FarmData);

        if (cropData.length > 0) {
          setFarmData(cropData[0]);

          const barData3Months = cropData[0].crops_for_3_months.map((crop) => ({
            label: crop.crop_name,
            value: crop.suitability_score,
          }));
          setBarChartData3Months(barData3Months);
          const barData6Months = cropData[0].crops_for_6_months.map((crop) => ({
            label: crop.crop_name,
            value: crop.suitability_score,
          }));
          setBarChartData6Months(barData6Months);
        } else {
          setFarmData(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchData();
    return () => unsubscribe();
  }, [id, navigation]);

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
      ) : farmData ? (
        <View style={styles.dataContainer}>
          <View
            style={[
              [styles.card, { backgroundColor: color.cardBg }],
              { backgroundColor: color.cardBg },
            ]}
          >
            <Text style={[styles.title, { color: color.text }]}>
              Farm Details
            </Text>
            <View style={styles.infoContainer}>
              <Text style={[styles.label, { color: color.text }]}>
                Farm ID:
              </Text>
              <Text style={[styles.value, { color: color.text }]}>
                {farmData.farm_id}
              </Text>
            </View>
            {farmData.soil_data && (
              <View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>
                    Soil Moisture:
                  </Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {farmData.soil_data.Moisture}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>
                    Soil pH:
                  </Text>
                  <Text style={[styles.value, { color: color.text }]}>
                    {farmData.soil_data.pH}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.label, { color: color.text }]}>
                    Soil NPK:
                  </Text>
                  <View style={styles.npkContainer}>
                    <View style={styles.npkBox}>
                      <Text style={styles.npkLabel}>N</Text>
                      <Text style={styles.npkValue}>
                        {farmData.soil_data.NPK.Nitrogen}
                      </Text>
                    </View>
                    <View style={styles.npkBox}>
                      <Text style={styles.npkLabel}>P</Text>
                      <Text style={styles.npkValue}>
                        {farmData.soil_data.NPK.Phosphorus}
                      </Text>
                    </View>
                    <View style={styles.npkBox}>
                      <Text style={styles.npkLabel}>K</Text>
                      <Text style={styles.npkValue}>
                        {farmData.soil_data.NPK.Potassium}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: color.cardBg }]}>
            <Text style={styles.chartTitle}>Crops for 3 Months</Text>
            <Text style={{ color: color.text }}>barchat</Text>

            {/* <BarChart
              data={barChartData3Months}
              barWidth={35}
              maxValue={100}
              noOfSections={4}
              cappedBars
              backgroundColor={color.cardBg}
              capColor={"rgb(78, 0, 142)"}
              yAxisColor={color.text}
              xAxisColor={color.text}
              yAxisTextStyle={{ color: color.text, fontSize: 12 }}
              xAxisLabelTextStyle={{ color: color.text, fontSize: 12 }}
              capThickness={4}
              isAnimated
              frontColor={color.tabIconSelected}
            /> */}
          </View>

          {farmData.crops_for_3_months.map((crop, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: color.cardBg }]}
            >
              <Text style={styles.subtitle}>Crop: {crop.crop_name}</Text>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  Suitability Score:
                </Text>
                {renderProgressBar(crop.suitability_score)}
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  Expected Yield:
                </Text>
                <Text style={[styles.value, { color: color.text }]}>
                  {crop.expected_yield_per_hectare} per hectare
                </Text>
              </View>
              <Text style={styles.recommendationTitle}>Recommendations:</Text>
              <View style={styles.recommendationContainer}>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationLabel}>Nitrogen:</Text>
                  <Text style={styles.recommendationValue}>
                    {crop.recommendations.fertilizer.nitrogen}
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationLabel}>Phosphorus:</Text>
                  <Text style={styles.recommendationValue}>
                    {crop.recommendations.fertilizer.phosphorus}
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationLabel}>Potassium:</Text>
                  <Text style={styles.recommendationValue}>
                    {crop.recommendations.fertilizer.potassium}
                  </Text>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  Irrigation:
                </Text>
                <Text style={[styles.value, { color: color.text }]}>
                  {crop.recommendations.irrigation}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  pH Adjustment:
                </Text>
                <Text style={[styles.value, { color: color.text }]}>
                  {crop.recommendations.pH_adjustment}
                </Text>
              </View>
            </View>
          ))}

          <View style={[styles.card, { backgroundColor: color.cardBg }]}>
            <Text style={styles.chartTitle}>Crops for 6 Months</Text>
            <Text style={{ color: color.text }}>barchat</Text>
            {/* <BarChart
              data={barChartData6Months}
              barWidth={35}
              maxValue={100}
              noOfSections={4}
              cappedBars
              capColor={"rgb(78, 0, 142)"}
              capThickness={4}
              yAxisColor={color.text}
              xAxisColor={color.text}
              yAxisTextStyle={{ color: color.text, fontSize: 12 }}
              xAxisLabelTextStyle={{ color: color.text, fontSize: 12 }}
              isAnimated
              frontColor={Colors.light.tabIconSelected}
            /> */}
          </View>

          {farmData.crops_for_6_months.map((crop, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: color.cardBg }]}
            >
              <Text style={styles.subtitle}>Crop: {crop.crop_name}</Text>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  Suitability Score:
                </Text>
                {renderProgressBar(crop.suitability_score)}
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  Expected Yield:
                </Text>
                <Text style={[styles.value, { color: color.text }]}>
                  {crop.expected_yield_per_hectare} per hectare
                </Text>
              </View>
              <Text style={styles.recommendationTitle}>Recommendations:</Text>
              <View style={styles.recommendationContainer}>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationLabel}>Nitrogen:</Text>
                  <Text style={styles.recommendationValue}>
                    {crop.recommendations.fertilizer.nitrogen}
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationLabel}>Phosphorus:</Text>
                  <Text style={styles.recommendationValue}>
                    {crop.recommendations.fertilizer.phosphorus}
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationLabel}>Potassium:</Text>
                  <Text style={styles.recommendationValue}>
                    {crop.recommendations.fertilizer.potassium}
                  </Text>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  Irrigation:
                </Text>
                <Text style={[styles.value, { color: color.text }]}>
                  {crop.recommendations.irrigation}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: color.text }]}>
                  pH Adjustment:
                </Text>
                <Text style={[styles.value, { color: color.text }]}>
                  {crop.recommendations.pH_adjustment}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noData}>No farm data available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dataContainer: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.light.tint,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: Colors.light.tint,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: Colors.light.tint,
  },
  cropContainer: {
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: Colors.light.tint,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: Colors.light.text,
  },
  npkContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  npkBox: {
    backgroundColor: Colors.light.tint,
    borderRadius: 4,
    padding: 8,
    marginLeft: 5,
    alignItems: "center",
    width: 60,
  },
  npkLabel: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  npkValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.light.tint,
  },
  progressBarText: {
    position: "absolute",
    right: 5,
    color: "gray",
    fontWeight: "bold",
  },
  recommendationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  recommendationItem: {
    flex: 1,
    alignItems: "center",
  },
  recommendationLabel: {
    fontSize: 12,
    color: Colors.light.tint,
    marginBottom: 2,
  },
  recommendationValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
});
