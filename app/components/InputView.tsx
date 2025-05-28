import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

type Props = {
  label: string;
  placeholder: string;
  iconName: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
};

const InputView = ({
  label,
  placeholder,
  iconName,
  value,
  onChangeText,
  secure = false,
}: Props) => {
  const { isDarkMode } = useContext(ThemeContext)!;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const borderColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const iconColor = isDarkMode ? Colors.dark.icon : Colors.light.icon;

  return (
    <View className="w-full mb-2">
      <Text className="font-bold mb-1" style={{ color: textColor }}>
        {label}
      </Text>
      <View
        style={{ borderColor }}
        className="border rounded-lg flex-row items-center px-4 py-2"
      >
        <Ionicons name={iconName} size={20} color={iconColor} />
        <TextInput
          className="ml-2 flex-1"
          style={{ color: textColor }}
          placeholder={placeholder}
          placeholderTextColor={iconColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !isPasswordVisible}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={{ padding: 4 }}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputView;
