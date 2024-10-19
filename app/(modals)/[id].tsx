import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { FarmData } from "@/constants/Types";
import { BarChart } from "react-native-gifted-charts";
import { Colors } from "@/constants/Colors";
import { title } from "process";

type Bardata = {
  label: string;
  value: number;
};

export default function Page() {
  const navigation = useNavigation();
  const { id, farmName } = useLocalSearchParams();
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [barChartData3Months, setBarChartData3Months] = useState<Bardata[]>([]);
  const [barChartData6Months, setBarChartData6Months] = useState<Bardata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: ` ${farmName}`,
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
    return () => unsubscribe(); // Cleanup on unmount
  }, [id, navigation]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      ) :
        farmData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.title}>Farm Details</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Farm ID: </Text>
              <Text style={styles.value}>{farmData.farm_id}</Text>
            </View>
            {/* <View style={styles.infoContainer}>
            <Text style={styles.label}>User ID: </Text>
            <Text style={styles.value}>{farmData.user_id}</Text>
          </View> */}

            {/* 3-Month Crop Data */}
            <Text style={styles.chartTitle}>Crops for 3 Months</Text>
            <BarChart
              data={barChartData3Months}
              barWidth={35}
              maxValue={100}
              noOfSections={4}
              cappedBars
              capColor={"rgb(78, 0, 142)"}
              capThickness={4}
              isAnimated
              frontColor={Colors.light.tabIconSelected}
            
            />

            {farmData.crops_for_3_months.map((crop, index) => (
              <View key={index} style={styles.cropContainer}>
                <Text style={styles.subtitle}>Crop: {crop.crop_name}</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Suitability Score: </Text>
                  <Text style={styles.value}>{crop.suitability_score}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Expected Yield (per hectare): </Text>
                  <Text style={styles.value}>
                    {crop.expected_yield_per_hectare}
                  </Text>
                </View>
                <Text style={styles.recommendationTitle}>Recommendations:</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Fertilizer - Nitrogen: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.fertilizer.nitrogen}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Fertilizer - Phosphorus: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.fertilizer.phosphorus}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Fertilizer - Potassium: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.fertilizer.potassium}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Irrigation: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.irrigation}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>pH Adjustment: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.pH_adjustment}
                  </Text>
                </View>
              </View>
            ))}

            {/* 6-Month Crop Data */}
            <Text style={styles.chartTitle}>Crops for 6 Months</Text>
            <BarChart
              data={barChartData6Months}
              barWidth={35}
              maxValue={100}
              noOfSections={4}
              cappedBars
              capColor={"rgb(78, 0, 142)"}
              capThickness={4}
              isAnimated
              frontColor={Colors.light.tabIconSelected}
            
            />

            {farmData.crops_for_6_months.map((crop, index) => (
              <View key={index} style={styles.cropContainer}>
                <Text style={styles.subtitle}>Crop: {crop.crop_name}</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Suitability Score: </Text>
                  <Text style={styles.value}>{crop.suitability_score}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Expected Yield (per hectare): </Text>
                  <Text style={styles.value}>
                    {crop.expected_yield_per_hectare}
                  </Text>
                </View>
                <Text style={styles.recommendationTitle}>Recommendations:</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Fertilizer - Nitrogen: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.fertilizer.nitrogen}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Fertilizer - Phosphorus: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.fertilizer.phosphorus}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Fertilizer - Potassium: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.fertilizer.potassium}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Irrigation: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.irrigation}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>pH Adjustment: </Text>
                  <Text style={styles.value}>
                    {crop.recommendations.pH_adjustment}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noData}>No farm data available.</Text>
        )
      }
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  chart: {
    marginVertical: 16,
  },
  cropContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  value: {
    fontWeight: "400",
    flex: 1,
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
