import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Markdown from "react-native-markdown-display";
import { CropInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";

export default function DiseaseResult(results: CropInfo) {
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
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Other Crops Infested
            </Text>
            {results.other_crops_infested.map((crop, index) => (
              <Text key={index} style={{ color: themeColors.text }}>
                {index + 1}. {"\t"}
                {crop}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={{ color: themeColors.text }}>
            No other crops infested
          </Text>
        )}

        {results.cause?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Causes
            </Text>
            {results.cause.map((cause, index) => (
              <Markdown key={index} style={markdownStyles}>
                {cause}
              </Markdown>
            ))}
          </View>
        ) : null}

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
            {results.life_cycle.map((lifeCycle, index) => (
              <Markdown key={index} style={markdownStyles}>
                {lifeCycle}
              </Markdown>
            ))}
          </View>
        ) : null}

        {results.remedy?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Remedy
            </Text>
            {results.remedy.map((remedy, index) => (
              <Markdown key={index} style={markdownStyles}>
                {remedy}
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

        {results.nutrient_deficiency?.length ? (
          <View
            style={[
              styles.resultsContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[styles.resultsSubHeading, { color: themeColors.tint }]}
            >
              Nutrient Deficiency
            </Text>
            {results.nutrient_deficiency.map((deficiency, index) => (
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
    color: Colors.light.tabIconSelected, // Remain static
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
