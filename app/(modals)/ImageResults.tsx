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
import * as FileSystem from "expo-file-system"; 
import DiseaseResult from "../components/imageResults/DiseaseResult";
import PestResult from "../components/imageResults/PestResult"; // Import PestResult component

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
  console.log(imageUri, token);


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
    console.log("Fetching results...", url, imageUri);
    try {
      setLoading(true);
      if (!imageUri) {
        setError("No image to process");
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      console.log("File Info:", fileInfo);

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

      console.log("API Response", apiResponse);
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
      console.log("API Response:", data);
      setError(null);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-screen h-[30vh] object-cover"
        />
      )}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tabIconSelected} />
      ) : (
        <View className="flex-1 p-4 justify-center items-center">
          {error ? (
            <View>
              <Text>{error}</Text>
              <View className="flex-row w-[80vw] gap-3 justify-center">
                <TouchableOpacity
                  className="bg-green-700 p-2 px-4"
                  onPress={() => handleFetchResults()}
                >
                  <Text className="text-white">Pest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-700 p-2 px-4"
                  onPress={() => {
                    setCropResults(null);
                    setPestResults(null);
                  }}
                >
                  <Text className="text-white">Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView
              stickyHeaderHiddenOnScroll={true}
              contentContainerStyle={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#f0f0f0",
                borderTopRightRadius: 28,
                borderTopLeftRadius: 28,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-xl font-bold text-center mb-4">
                Analysis Results
              </Text>
              {Cropresults ? (
                <DiseaseResult {...Cropresults} />
              ) : Pestresults ? (
                <PestResult {...Pestresults} />
              ) : (
                <View>
                  <Text>Choose what you want to analyse in the image</Text>
                  <View className="flex w-full flex-row justify-start gap-7">
                    <TouchableOpacity
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
