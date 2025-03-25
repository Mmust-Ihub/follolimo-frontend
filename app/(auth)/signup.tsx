// AIzaSyDzCeN5ACBmB662_hCyAQVtGGjVSedQne4
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import Modal from "react-native-modal";
import { Feather, Ionicons } from "@expo/vector-icons"; // Use Ionicons from @expo/vector-icons
import { Link } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext"; // For theme management
import { Colors } from "@/constants/Colors"; // Custom colors based on themes

export default function SignUp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCOpen, setIsCOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Get AuthContext and check if it's defined
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts not found");
  }

  const { register, isLoading } = authContext;
  const { isDarkMode } = themeContext;

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!username || !email || !password || !confirmPassword) {
      setModalMessage("All fields are required");
      setIsModalVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setModalMessage("Password does not match");
      setIsModalVisible(true);
      return;
    }
    const emailTest =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!emailTest.test(email)) {
      setModalMessage("Invalid email address");
      setIsModalVisible(true);
      return;
    }
    const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordTest.test(password)) {
      setModalMessage(
        "Password must contain at least 8 characters, one Uppercase, one Lowercase, and one Number"
      );
      setIsModalVisible(true);
      return;
    }
    register(email, username, password, confirmPassword);
  };

  const handleOpen = () => setIsOpen((prev) => !prev);
  const handleCOpen = () => setIsCOpen((prev) => !prev);

  // Set theme-based colors
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const inputBorderColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const iconColor = isDarkMode ? Colors.dark.icon : Colors.light.icon;

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ backgroundColor }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={{ color: textColor }} className="text-lg mt-4">
          Registering...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor }} className="flex-1">
      <KeyboardAvoidingView
        className="flex justify-center items-center h-screen px-4 space-y-6"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="space-y-4 w-full">
            <Text
              style={{ color: textColor }}
              className="font-extrabold text-xl uppercase text-center mb-4"
            >
              Register To Fololimo
            </Text>

            {/* Username input with icon */}
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons name="person-outline" size={20} color={iconColor} />
              <TextInput
                onChange={(e) => setUsername(e.nativeEvent.text)}
                className="ml-2 flex-1"
                placeholder="Username..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
            </View>

            {/* Email input with icon */}
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons name="mail-outline" size={20} color={iconColor} />
              <TextInput
                onChange={(e) => setEmail(e.nativeEvent.text)}
                className="ml-2 flex-1"
                placeholder="Email..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
            </View>

            {/* Password input with icon */}
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={iconColor}
              />
              <TextInput
                onChange={(e) => setPassword(e.nativeEvent.text)}
                secureTextEntry={!isOpen}
                className="ml-2 flex-1"
                placeholder="Password..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
              <TouchableOpacity onPress={handleOpen}>
                <Feather
                  name={isOpen ? "eye" : "eye-off"}
                  size={24}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password input with icon */}
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={iconColor}
              />
              <TextInput
                onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                secureTextEntry={!isCOpen}
                className="ml-2 flex-1"
                placeholder="Confirm Password..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
              <TouchableOpacity onPress={handleCOpen}>
                <Feather
                  name={isCOpen ? "eye" : "eye-off"}
                  size={24}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>

            {/* Register button */}
            <View className="w-full">
              <TouchableOpacity
                className="bg-green-500 rounded-lg w-full px-4 py-3"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center font-bold">
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login link below the Register button */}
            <View className="w-full flex flex-row justify-start mt-2">
              <TouchableOpacity className="flex flex-row gap-2">
                <Link href="/(auth)/Login" className="text-green-500 text-md">
                  <Text className="text-lg underline">
                    Already have an account?
                  </Text>
                  <Text className="text-green-500 text-lg underline">
                    {" "}
                    Login
                  </Text>
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
            Error
          </Text>
          <Text style={{ fontSize: 16, marginTop: 10, textAlign: "center" }}>
            {modalMessage}
          </Text>
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={{
              backgroundColor: "green",
              padding: 10,
              marginTop: 20,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingHorizontal: 20,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
