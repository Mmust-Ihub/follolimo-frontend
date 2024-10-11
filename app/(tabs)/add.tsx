import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/contexts/ThemeContext"; // Import your ThemeContext
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AddFarm() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("Contexts not found");
  }

  const { isDarkMode } = themeContext;
  // Set theme-based colors
  const backgroundColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const formBackgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const placeholderColor = isDarkMode ? "lightgray" : "gray"; // Adjust based on theme

  return (
    <SafeAreaView
      className="flex-1 justify-center items-center w-full"
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      <View className="items-center justify-center w-full h-[100px] mb-2">
        <Text className="text-white text-2xl font-extrabold">
          Farm Registration
        </Text>
        <Text className="text-white text-base font-semibold">
          Please fill in the details
        </Text>
      </View>

      {/* Form Section */}
      <ScrollView
        className="flex-1 w-full px-4 rounded-t-[30px]"
        style={{ backgroundColor: formBackgroundColor }}
      >
        <KeyboardAvoidingView className="w-full gap-6 mt-6">
          {/* Name Input */}
          <View className="w-full mb-2">
            <Text className="mb-2" style={{ color: textColor }}>
              Name
            </Text>
            <View className="border rounded-lg w-full flex flex-row items-center px-4 py-2 border-green-500">
              <Ionicons
                name="person-outline"
                size={20}
                color={placeholderColor}
              />
              <TextInput
                placeholder="Enter name..."
                placeholderTextColor={placeholderColor}
                className="ml-2 flex-1 text-black" // Keeps the default input style
              />
            </View>
          </View>

          {/* Location Input */}
          <View className="w-full mb-2">
            <Text className="mb-2" style={{ color: textColor }}>
              Location
            </Text>
            <View className="border rounded-lg w-full flex flex-row items-center px-4 py-2 border-green-500">
              <Ionicons
                name="location-outline"
                size={20}
                color={placeholderColor}
              />
              <TextInput
                placeholder="Enter location..."
                placeholderTextColor={placeholderColor}
                className="ml-2 flex-1 text-black" // Keeps the default input style
              />
            </View>
          </View>

          {/* Farm Size Input */}
          <View className="w-full mb-6">
            <Text className="mb-2" style={{ color: textColor }}>
              Farm Size
            </Text>
            <View className="border rounded-lg w-full flex flex-row items-center px-4 py-2 border-green-500">
              <MaterialCommunityIcons
                name="tape-measure"
                size={20}
                color={placeholderColor}
              />
              <TextInput
                placeholder="Enter farm size..."
                placeholderTextColor={placeholderColor}
                className="ml-2 flex-1 text-black" // Keeps the default input style
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-green-500 py-4 rounded-full items-center w-full mb-2"
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg font-semibold">Register</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
