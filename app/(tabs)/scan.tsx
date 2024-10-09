import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useState } from "react";
import PhotoCamera from "../components/PhotoCamera";

export default function Scan() {
  const [cropImage, setCropImage] = useState(null);

  return (
    <SafeAreaView className="flex-1">
      {cropImage ? (
        <Image
          source={{ uri: cropImage }}
          style={{ width: "100%", height: 300 }}
        />
      ) : (
        <Text>No Image Selected</Text>
      )}
      <PhotoCamera onCapture={setCropImage} />
    </SafeAreaView>
  );
}
