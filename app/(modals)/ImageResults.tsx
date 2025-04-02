import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { CropInfo, PestInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext"; // Import ThemeContext
import * as FileSystem from "expo-file-system";
import DiseaseResult from "../components/imageResults/DiseaseResult";
import PestResult from "../components/imageResults/PestResult";

export default function ImageResults() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext not found");
  }
  const { userToken: token } = authContext;

  const image = useImageContext();
  if (!image) {
    throw new Error("ImageContext not found");
  }
  const { imageUri } = image;
  if (!imageUri) {
    throw new Error("Image URI not found");
  }

  const themeContext = useContext(ThemeContext); // Access the theme context
  const isDarkMode = themeContext?.isDarkMode || false; // Get current theme
  const themeColors = isDarkMode ? Colors.dark : Colors.light; // Use colors based on theme

  const [Cropresults, setCropResults] = useState<CropInfo | null>(null);
  const [Pestresults, setPestResults] = useState<PestInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [whatTofetch, setWhatToFetch] = useState<string>("disease");

  const handleFetchResults = async () => {
    if (!whatTofetch) {
      setError("Please select the type of analysis you want to perform");
      return;
    }

    const url = `${process.env.EXPO_PUBLIC_NODEAPI_URL}/model/${whatTofetch}`;

    try {
      setLoading(true);
      if (!imageUri) {
        setError("No image to process");
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      const formData = new FormData();
      // @ts-expect-error: special react native format for form data
      formData.append("photo", {
        uri: imageUri,
        name: fileInfo.uri.split("/").pop(),
        type: "image/jpeg",
      });

      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        setError("An error occurred");
        setCropResults(null);
        setPestResults(null);
        return;
      }

      const data = await apiResponse.json();
      if (whatTofetch === "pest") {
        setPestResults(data);
      } else {
        setCropResults(data);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: themeColors.background }}
    >
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-screen h-[30vh] object-cover"
        />
      )}
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.tabIconSelected} />
      ) : (
        <View className="flex-1 p-4 justify-center items-center">
          {error ? (
            <View>
              <Text style={{ color: themeColors.text }}>{error}</Text>
              <View className="flex-row w-[80vw] gap-3 justify-center">
                <TouchableOpacity
                  className="bg-green-700 p-2 px-4"
                  onPress={() => handleFetchResults()}
                >
                  <Text style={{ color: "white" }}>Pest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-700 p-2 px-4"
                  onPress={() => {
                    setCropResults(null);
                    setPestResults(null);
                  }}
                >
                  <Text style={{ color: "white" }}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView
              stickyHeaderHiddenOnScroll={true}
              contentContainerStyle={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: themeColors.background,
                borderTopRightRadius: 28,
                borderTopLeftRadius: 28,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                className="text-xl font-bold text-center mb-4"
                style={{ color: themeColors.text }}
              >
                Analysis Results
              </Text>
              {Cropresults ? (
                <DiseaseResult {...Cropresults} />
              ) : Pestresults ? (
                <PestResult {...Pestresults} />
              ) : (
                <View className="space-y-1">
                  <Text style={{ color: themeColors.text }}>
                    Choose what you want to analyse in the image
                  </Text>
                  <View className="flex w-full flex-row justify-start gap-7">
                    <TouchableOpacity
                      className="px-6 py-2 mb-4"
                      style={[
                        styles.button,
                        whatTofetch === "pest"
                          ? { backgroundColor: Colors.darkGreen }
                          : { backgroundColor: "gray" },
                      ]}
                      onPress={() => setWhatToFetch("pest")}
                    >
                      <Text style={styles.buttonText}>Pest</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="px-6 py-2 mb-4"
                      style={[
                        styles.button,
                        whatTofetch === "disease"
                          ? { backgroundColor: Colors.darkGreen }
                          : { backgroundColor: "gray" },
                      ]}
                      onPress={() => setWhatToFetch("disease")}
                    >
                      <Text style={styles.buttonText}>Disease</Text>
                    </TouchableOpacity>
                  </View>

                  {whatTofetch && (
                    <TouchableOpacity
                      onPress={handleFetchResults}
                      style={styles.submitButton}
                    >
                      <Text style={styles.submitButtonText}>
                        Submit Results
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: Colors.light.tabIconSelected,
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
