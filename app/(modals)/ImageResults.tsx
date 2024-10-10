import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { CropInfo, PestInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthContext";
import * as FileSystem from "expo-file-system"; // Import FileSystem for reading files

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
  const { imageUri } = image; // Assume imageUri is a string
  if (!imageUri) {
    throw new Error("Image URI not found");
  }
  console.log(imageUri, token);

  const url = `${process.env.EXPO_PUBLIC_NODEAPI_URL}/model/disease`;
  const [results, setResults] = useState<CropInfo | PestInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetchResults = async () => {
    console.log("Fetching results...", url, imageUri);
    try {
      setLoading(true);
      if (!imageUri) {
        setError("No image to process");
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      console.log("File Info:", fileInfo);

      const fileContent = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64, 
      });

      // Create FormData and append the file as a Blob
      const blob = new Blob([fileContent], { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("files", blob, fileInfo.uri.split("/").pop()); // Append blob with filename


      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log(apiResponse, "API Response");
      if (!apiResponse.ok) {
        setError("An error occurred");
        return;
      }

      const data = await apiResponse.json();
      setResults(data); // Handle the result data
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (imageUri) {
      handleFetchResults();
    }
  }, [imageUri]);

  return (
    <View className="flex-1 justify-center items-center">
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-screen h-[35vh] object-cover"
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
                  onPress={handleFetchResults}
                >
                  <Text className="text-white">Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-700 p-2 px-4"
                  onPress={() => setResults(null)}
                >
                  <Text className="text-white">Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView>
              {results ? (
                <View>
                  <Text className="text-xl font-bold text-center mb-4">
                    Analysis Results
                  </Text>
                  {"disease" in results && (
                    <Text>
                      Disease: {results.disease}
                      {"\n"}
                    </Text>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-green-700 p-2 px-4"
                  onPress={handleFetchResults}
                >
                  <Text className="text-white">Retry</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
