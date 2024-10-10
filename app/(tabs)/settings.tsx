import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "@/contexts/ThemeContext"; // Theme context for dark mode
import { Colors } from "@/constants/Colors";

export default function Settings() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext not found");
  }
  const { logout } = authContext;

  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ThemeContext not found");
  }
  const { isDarkMode, toggleTheme } = themeContext;

  // Determine background and text colors based on theme
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const iconColor = isDarkMode ? Colors.dark.icon : Colors.light.icon;

  return (
    <View
      style={{ backgroundColor }}
      className="flex-1 p-5 transition-colors ease-in-out"
    >
      <ScrollView className="w-full">
        {/* Profile */}
        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
          <Ionicons name="person-outline" size={24} color={iconColor} />
          <Text style={{ color: textColor }} className="flex-1 ml-4 text-lg">
            Profile
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
          <Text style={{ color: textColor }} className="flex-1 ml-4 text-lg">
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        {/* Theme Toggle */}
        <View className="flex-row items-center py-4 border-b border-gray-200">
          <Ionicons name="color-palette-outline" size={24} color={iconColor} />
          <Text style={{ color: textColor }} className="flex-1 ml-4 text-lg">
            Dark Mode
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#fff" }}
            thumbColor={isDarkMode ? "#00ff00" : "#00ff00"}
            onValueChange={toggleTheme}
            value={isDarkMode}
            className="ml-4"
          />
        </View>

        {/* Language */}
        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
          <Feather name="globe" size={24} color={iconColor} />
          <Text style={{ color: textColor }} className="flex-1 ml-4 text-lg">
            Language
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        {/* Help */}
        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
          <MaterialIcons name="help-outline" size={24} color={iconColor} />
          <Text style={{ color: textColor }} className="flex-1 ml-4 text-lg">
            Help
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center justify-center mt-8 bg-red-600 py-4 px-6 rounded-lg"
          activeOpacity={0.7}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text className="ml-2 text-lg font-semibold text-white">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
