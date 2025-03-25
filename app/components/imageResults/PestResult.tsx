import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Markdown from "react-native-markdown-display";
import { PestInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext"; // Import theme context

export default function PestResult(results: PestInfo) {
  const themeContext = useContext(ThemeContext); // Access the theme context
  const isDarkMode = themeContext?.isDarkMode || false; // Get current theme
  const themeColors = isDarkMode ? Colors.dark : Colors.light; // Use theme colors based on mode

  // Define markdown styles based on the theme
  const markdownStyles = {
    body: {
      color: themeColors.text,
    },
    heading1: {
      color: themeColors.tint,
    },
    heading2: {
      color: themeColors.tint,
    },
    // You can add more specific styles for other Markdown elements here
  };

  return (
    <View>
      <View
        style={[styles.majorInfo, { backgroundColor: themeColors.background }]}
      >
        {results.pest_name ? (
          <Text style={styles.majorInfoText}>Pest: {results.pest_name}</Text>
        ) : (
          <Text style={styles.majorInfoText}>Pest data not available</Text>
        )}
      </View>

      <View>
        {results.affected_crops?.length ? (
          <View>
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Affected Crops
            </Text>
            {results.affected_crops.map((crop, index) => (
              <Text key={index} style={{ color: themeColors.text }}>
                {index + 1}. {"\t"}
                {crop}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={{ color: themeColors.text }}>
            No affected crops listed
          </Text>
        )}

        {results.life_cycle?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Life Cycle
            </Text>
            {results.life_cycle.map((cycle, index) => (
              <Markdown key={index} style={markdownStyles}>
                {cycle}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.treatment?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Treatment
            </Text>
            {results.treatment.map((treatment, index) => (
              <Markdown key={index} style={markdownStyles}>
                {treatment}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.preventive_measures?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Preventive Measures
            </Text>
            {results.preventive_measures.map((measure, index) => (
              <Markdown key={index} style={markdownStyles}>
                {measure}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.environment_conditions?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Environment Conditions
            </Text>
            {results.environment_conditions.map((condition, index) => (
              <Markdown key={index} style={markdownStyles}>
                {condition}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.nutrient_deficiencies?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Nutrient Deficiencies
            </Text>
            {results.nutrient_deficiencies.map((deficiency, index) => (
              <Markdown key={index} style={markdownStyles}>
                {deficiency}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.companion_planting?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Companion Planting
            </Text>
            {results.companion_planting.map((plant, index) => (
              <Markdown key={index} style={markdownStyles}>
                {plant}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.post_harvest_handling?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Post Harvest Handling
            </Text>
            {results.post_harvest_handling.map((handling, index) => (
              <Markdown key={index} style={markdownStyles}>
                {handling}
              </Markdown>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  majorInfo: {
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
    color: Colors.light.tabIconSelected, // Static color for title
  },
  resultsSubHeading: {
    fontSize: 16,
    fontWeight: "semibold",
    textDecorationLine: "underline",
  },
  resultsContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "column",
  },
});
