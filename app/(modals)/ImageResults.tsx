import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { CropInfo, PestInfo } from "@/constants/Types";
import { Colors } from "@/constants/Colors";

export default function ImageResults() {
  const token = "!!@@##$$%%^^&&**((()))++==";
  const image = useImageContext();
  if (!image) {
    throw new Error("ImageContext not found");
  }
  const { imageUri } = image;
  console.log(imageUri);

  const url = "https://fololimo-api.vercel.app/api/v1/model/disease";
  const [results, setResults] = useState<CropInfo | PestInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const HandleFetchResults = async () => {
      try {
        setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          image: imageUri,
        }),
      });
      console.log(response);
      if (!response.ok) {
        setError("An error occurred");
      }
      const data = await response.json();
      setResults(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    if (imageUri) {
      HandleFetchResults();
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
            <Text>{error}</Text>
          ) : (
            <Text>Data fetched successfullty</Text>
          )}
        </View>
      )}
    </View>
  );
}
