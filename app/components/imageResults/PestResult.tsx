import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Markdown from "react-native-markdown-display";
import { PlantInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";

export default function PestResult({ results }: { results: PlantInfo }) {
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  console.log("Pest results", results);

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
  };

  const renderSection = (title: string, items?: string[]) => {
    if (!items?.length) return null;

    return (
      <View
        style={[
          styles.resultsContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Text style={[styles.resultsSubHeading, { color: themeColors.tint }]}>
          {title}
        </Text>
        {items.map((item, index) => (
          <Markdown key={index} style={markdownStyles}>
            {item}
          </Markdown>
        ))}
      </View>
    );
  };

  return (
    <View>
      <View
        style={[styles.majorInfo, { backgroundColor: themeColors.background }]}
      >
        <Text style={styles.majorInfoText}>
          {results.common_name
            ? `Pest: ${results.common_name}`
            : "Pest data not available"}
        </Text>
      </View>

      {results.affected_crops?.length ? (
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.resultsSubHeading, { color: themeColors.tint }]}>
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

      {renderSection("Life Cycle", results.life_cycle)}
      {renderSection("Treatment", results.treatment)}
      {renderSection("Preventive Measures", results.preventive_measures)}
      {renderSection("Environment Conditions", results.environment_conditions)}
      {renderSection("Companion Planting", results.companion_planting)}
      {renderSection("Post Harvest Handling", results.post_harvest_handling)}
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
    color: Colors.light.tabIconSelected,
  },
  resultsSubHeading: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  resultsContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "column",
  },
});
