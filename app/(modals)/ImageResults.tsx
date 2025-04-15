import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import * as FileSystem from "expo-file-system";
import { Colors } from "@/constants/Colors";
import DiseaseResult from "../components/imageResults/DiseaseResult";
import PestResult from "../components/imageResults/PestResult";
import { PlantInfo } from "@/constants/Types";

const ImageResults = () => {
  const { userToken: token } = useContext(AuthContext)!;
  const { imageUri } = useImageContext()!;
  const { isDarkMode } = useContext(ThemeContext)!;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const [cropResults, setCropResults] = useState<PlantInfo | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchResults = async () => {
    if (!imageUri) return setError("No image selected");
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    const formData = new FormData();
    // @ts-expect-error: React Native FormData
    formData.append("file", {
      uri: imageUri,
      name: fileInfo.uri.split("/").pop(),
      type: "image/jpeg",
    });

    try {
      console.log("Image analysis request body:", formData);
      setLoading(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_NODEAPI_URL}/ai/analyse`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      console.log("Image analysis response status:", res);

      const data = await res.json();
      console.log("Image analysis response:", data);

      if (res.status === 200) {
        setCropResults(data);
        setError(null);
      }
      if (res.status === 401) {
        setError("Unauthorized. Please log in again.");
      }
    } catch (err) {
      console.error(err);
      setError("Image uploaded not a plant.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCropResults(null);
    setError(null);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {loading ? (
        <View>
          <ActivityIndicator size="large" color={themeColors.tint} />
          <Text style={[styles.heading, { color: themeColors.text }]}>
            Analyzing image...
          </Text>
        </View>
      ) : (
        <View style={styles.inner}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: themeColors.text }]}>
                {error}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleFetchResults}
                >
                  <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClear}
                >
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { backgroundColor: themeColors.background },
              ]}
            >
              <Text style={[styles.heading, { color: themeColors.text }]}>
                Analysis Results
              </Text>

              {cropResults ? (
                <PestResult results={cropResults} />
              ) : (
                <View style={styles.selectionContainer}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleFetchResults}
                  >
                    <Text style={styles.buttonText}>Submit For Analysis</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default ImageResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "30%",
    resizeMode: "cover",
  },
  scrollContent: {
    padding: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  selectionContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: Colors.light.tabIconSelected,
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  actionButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
  },
  errorText: {
    marginBottom: 10,
    fontSize: 16,
  },
});
