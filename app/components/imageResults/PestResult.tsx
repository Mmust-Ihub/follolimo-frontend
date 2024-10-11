import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { PestInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";

export default function PestResult(results: PestInfo) {
  return (
    <View>
      

      <View style={styles.majorInfo}>
        {results.pest_name ? (
          <Text style={styles.majorInfoText}>Pest: {results.pest_name}</Text>
        ) : (
          <Text style={styles.majorInfoText}>Pest data not available</Text>
        )}
      </View>

      <View>
        {results.affected_crops?.length ? (
          <View>
            <Text style={styles.resultsSubHeading}>Affected Crops</Text>
            {results.affected_crops.map((crop, index) => (
              <Text key={index}>
                {index + 1}. {"\t"}
                {crop}
              </Text>
            ))}
          </View>
        ) : (
          <Text>No affected crops listed</Text>
        )}

        {results.life_cycle?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Life Cycle</Text>
            {results.life_cycle.map((cycle, index) => (
              <Markdown key={index}>{cycle}</Markdown>
            ))}
          </View>
        ) : null}

        {results.treatment?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Treatment</Text>
            {results.treatment.map((treatment, index) => (
              <Markdown key={index}>{treatment}</Markdown>
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

        {results.nutrient_deficiencies?.length ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsSubHeading}>Nutrient Deficiencies</Text>
            {results.nutrient_deficiencies.map((deficiency, index) => (
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
