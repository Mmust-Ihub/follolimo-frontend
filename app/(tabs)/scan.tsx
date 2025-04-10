import { SafeAreaView } from "react-native";
import React from "react";
import PhotoCamera from "../components/PhotoCamera";

export default function scan() {
  return (
    <SafeAreaView className="flex-1">
      <PhotoCamera />
    </SafeAreaView>
  );
}
