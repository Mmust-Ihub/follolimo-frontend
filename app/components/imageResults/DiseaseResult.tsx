import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { CropInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";

export default function DiseaseResult(results: CropInfo) {
  return (
    <View>
      <Text className="text-xl font-bold text-center mb-4">
        Analysis Results
      </Text>

      <View style={styles.majorInfo}>
        {results.crop ? (
          <Text style={styles.majorInfoText}>Crop: {results.crop}</Text>
        ) : (
          <Text style={styles.majorInfoText}>Crop data not available</Text>
        )}

        {results.disease ? (
          <Text style={styles.majorInfoText}>Disease: {results.disease}</Text>
        ) : (
          <Text style={styles.majorInfoText}>No disease detected</Text>
        )}
      </View>

      <View>
        {results.other_crops_infested?.length ? (
          <View>
            <Text style={styles.resultsSubHeading}>Other Crops Infested</Text>
            {results.other_crops_infested.map((crop, index) => (
              <Text key={index}>
                {index + 1}. {"\t"}
                {crop}
              </Text>
            ))}
          </View>
        ) : (
          <Text>No other crops infested</Text>
        )}

        {results.cause?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Causes</Text>
            {results.cause.map((cause, index) => (
              <Markdown key={index}>{cause}</Markdown>
            ))}
          </View>
        ) : null}

        {results.life_cycle?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Life Cycle</Text>
            {results.life_cycle.map((lifeCycle, index) => (
              <Markdown key={index}>{lifeCycle}</Markdown>
            ))}
          </View>
        ) : null}

        {results.remedy?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Remedy</Text>
            {results.remedy.map((remedy, index) => (
              <Markdown key={index}>{remedy}</Markdown>
            ))}
          </View>
        ) : null}

        {results.preventive_measures?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Preventive Measures</Text>
            {results.preventive_measures.map((measure, index) => (
              <Markdown key={index}>{measure}</Markdown>
            ))}
          </View>
        ) : null}

        {results.environment_conditions?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Environment Conditions</Text>
            {results.environment_conditions.map((condition, index) => (
              <Markdown key={index}>{condition}</Markdown>
            ))}
          </View>
        ) : null}

        {results.nutrient_deficiency?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Nutrient Deficiency</Text>
            {results.nutrient_deficiency.map((deficiency, index) => (
              <Markdown key={index}>{deficiency}</Markdown>
            ))}
          </View>
        ) : null}

        {results.companion_planting?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Companion Planting</Text>
            {results.companion_planting.map((plant, index) => (
              <Markdown key={index}>{plant}</Markdown>
            ))}
          </View>
        ) : null}

        {results.post_harvest_handling?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Post Harvest Handling</Text>
            {results.post_harvest_handling.map((handling, index) => (
              <Markdown key={index}>{handling}</Markdown>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  majorInfo: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 5,
  },
  majorInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.tabIconSelected,
  },
  resultsSubHeading: {
    fontSize: 16,
    fontWeight: "semibold",
    color: Colors.light.tabIconSelected,
    textDecorationColor: Colors.light.tabIconSelected,
    textDecorationLine: "underline",
  },
  resultsContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "column",
  },
});
