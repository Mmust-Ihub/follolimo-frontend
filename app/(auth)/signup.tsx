import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Get AuthContext and check if it's defined
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts not found");
  }

  if (!themeContext) {
    throw new Error(
      "AuthContext, OnboardingContext, and ThemeContext must be used within their providers"
    );
  }

  const { isDarkMode } = themeContext;
  const headerBackgroundColor = isDarkMode
    ? Colors.dark.headerBackground
    : Colors.light.headerBackground;

  const { register, isAutLoading } = authContext;

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setModalMessage("All fields are required");
      setIsModalVisible(true);
      return;
    }
    // check if lastname and first name are less than 3 characters
    if (firstName.trim().length < 3) {
      setModalMessage("Firstname must be at least 3 characters long");
      setIsModalVisible(true);
      return;
    }
    if (lastName.trim().length < 3) {
      setModalMessage("Lastname must be at least 3 characters long");
      setIsModalVisible(true);
      return;
    }

    // check if lastname and first name are containing numbers
    const nameTest = /^[a-zA-Z]+$/;
    if (!nameTest.test(firstName.trim())) {
      setModalMessage(
        "Firstname must not contain numbers or special characters"
      );
      setIsModalVisible(true);
      return;
    }
    if (!nameTest.test(lastName.trim())) {
      setModalMessage(
        "Lastname must not contain numbers or special characters"
      );
      setIsModalVisible(true);
      return;
    }

    if (username.trim().length < 3) {
      setModalMessage("Username must be at least 3 characters long");
      setIsModalVisible(true);
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setModalMessage("Password does not match");
      setIsModalVisible(true);
      return;
    }
    const emailTest =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!emailTest.test(email.trim())) {
      setModalMessage("Invalid email address");
      setIsModalVisible(true);
      return;
    }
    const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordTest.test(password.trim())) {
      setModalMessage(
        "Password must contain at least 8 characters, one Uppercase, one Lowercase, and one Number"
      );
      setIsModalVisible(true);
      return;
    }
    register(
      email.trim(),
      username.trim(),
      password.trim(),
      firstName.trim(),
      lastName.trim()
    );
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

  return (
    <SafeAreaView style={{ backgroundColor }} className="flex-1">
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={headerBackgroundColor}
      />
      <KeyboardAvoidingView
        className="flex justify-center items-center h-screen px-4 space-y-6"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="space-y-2 w-full gap-2">
            <Text
              style={{ color: textColor }}
              className="font-extrabold text-xl uppercase text-center mb-4"
            >
              Register To Fololimo
            </Text>
            <View className="w-full flex flex-row">
              <View className="w-[49%] mr-2">
                <Text className="font-bold" style={{ color: textColor }}>
                  Firstname
                </Text>
                <View
                  style={{ borderColor: inputBorderColor }}
                  className="border rounded-lg w-full flex flex-row items-center px-4 py-1 "
                >
                  <Ionicons name="mail-outline" size={20} color={iconColor} />
                  <TextInput
                    onChange={(e) => setFirstName(e.nativeEvent.text)}
                    className="w-full"
                    placeholder="Firstname..."
                    placeholderTextColor={iconColor}
                    style={{ color: textColor }}
                  />
                </View>
              </View>

              <View className="w-[49%]">
                <Text className="font-bold" style={{ color: textColor }}>
                  Lastname
                </Text>
                <View
                  style={{ borderColor: inputBorderColor }}
                  className="border rounded-lg w-full flex flex-row items-center px-4 py-1"
                >
                  <Ionicons name="mail-outline" size={20} color={iconColor} />
                  <TextInput
                    onChange={(e) => setLastName(e.nativeEvent.text)}
                    className="w-full"
                    placeholder="Lastname..."
                    placeholderTextColor={iconColor}
                    style={{ color: textColor }}
                  />
                </View>
              </View>
            </View>

            {/* Username input with icon */}
            <Text className="font-bold" style={{ color: textColor }}>
              Username*
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-1"
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
            <Text className="font-bold" style={{ color: textColor }}>
              Email*
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-1"
            >
              <Ionicons name="mail-outline" size={20} color={iconColor} />
              <TextInput
                onChange={(e) => setEmail(e.nativeEvent.text)}
                className="ml-2 flex-1"
                placeholder="Email..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                keyboardType="email-address"
              />
            </View>

            {/* Password input with icon */}
            <Text className="font-bold" style={{ color: textColor }}>
              Password*
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-1"
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
            <Text className="font-bold" style={{ color: textColor }}>
              Confirmed Password
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-1"
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
            <View className="w-full mt-2 mb-1">
              <TouchableOpacity
                className="bg-green-500 rounded-lg w-full px-4 py-3"
                onPress={handleSubmit}
                disabled={isAutLoading}
                activeOpacity={0.7} // Add this line for feedback on press
              >
                {isAutLoading ? (
                  <View className="flex flex-row justify-center items-center gap-2">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-center font-bold">
                      Registering...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-bold">
                    Register
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {/* Login link below the Register button */}
            <View className="w-full flex flex-row justify-start ">
              <TouchableOpacity className="flex flex-row gap-2">
                <Link href="/(auth)/Login" className="text-green-500 text-md">
                  <Text className="text-lg underline">
                    Already have an account?
                  </Text>
                  <Text className="text-green-500 text-lg underline font-bold">
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
