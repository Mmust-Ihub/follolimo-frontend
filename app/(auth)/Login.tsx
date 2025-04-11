import React, { useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/contexts/AuthContext";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext"; // For theme management
import { Colors } from "@/constants/Colors"; // Custom colors based on themes

export default function Login() {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts not found");
  }

  const { login, isAutLoading } = authContext;
  const { isDarkMode } = themeContext;

  const handleLogin = () => {
    if (!username || !password) {
      setModalMessage("All fields are required");
      setIsModalVisible(true);
      return;
    }
    // if (username.trim().length < 3) {
    //   setModalMessage("Username must be at least 3 characters long");
    //   setIsModalVisible(true);
    //   return;
    // }
    // check if username or email is valid
    // const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // const emailTest =
    //   /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    // if (!emailTest.test(email.trim())) {
    //   setModalMessage("Invalid email address");
    //   setIsModalVisible(true);
    //   return;
    // }
    // const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // if (!passwordTest.test(password.trim())) {
    //   setModalMessage(
    //     "Password must contain at least 8 characters, one Uppercase, one Lowercase, and one Number"
    //   );
    //   setIsModalVisible(true);
    //   return;
    // }
    login(username.trim(), password.trim());
    Keyboard.dismiss();
  };

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Set theme-based colors
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const inputBorderColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const iconColor = isDarkMode ? Colors.dark.icon : Colors.light.icon;
  const headerBackgroundColor = isDarkMode
    ? Colors.dark.headerBackground
    : Colors.light.headerBackground;

  return (
    <SafeAreaView style={{ backgroundColor }} className="flex-1">
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={headerBackgroundColor}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex justify-center items-center h-screen px-4 space-y-2 w-screen"
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="space-y-2 w-full gap-2">
            <View className="w-full flex justify-center items-center">
              <Image
                source={require("../../assets/img/fololimo.png")}
                style={{ width: 200 }}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <Text
              style={{ color: textColor }}
              className="font-extrabold text-xl uppercase text-center mb-4 "
            >
              Login to your account
            </Text>

            {/* Username input with icon */}
            <Text className="font-bold" style={{ color: textColor }}>
              Username or Email
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons name="person-outline" size={20} color={iconColor} />
              <TextInput
                onChange={(e) => setUsername(e.nativeEvent.text)}
                className="ml-2 flex-1"
                placeholder="Enter or Username..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
            </View>

            {/* Password input with icon */}
            <Text className="font-bold" style={{ color: textColor }}>
              Password
            </Text>
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
                placeholder="Enter Password..."
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

            {/* Forgot Password link */}
            {/* <View className="w-full">
              <TouchableOpacity className="mt-2">
                <Text
                  style={{ color: Colors.light.tint }}
                  className="text-lg text-right underline"
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* Login button */}
            <View className="w-full mt-4">
              <TouchableOpacity
                className="bg-green-500 rounded-lg w-full px-4 py-3"
                onPress={handleLogin}
                disabled={isAutLoading}
                activeOpacity={0.7}
              >
                {isAutLoading ? (
                  <View className="flex flex-row justify-center items-center gap-2">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-center font-bold">
                      Logging in...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-bold">
                    Login
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Sign Up link */}
            <View className="w-full flex flex-row justify-start mt-2">
              <TouchableOpacity
                className="flex flex-row justify-center items-center"
                onPress={() => router.replace("/(auth)/signup")}
              >
                <Text
                  style={{ color: Colors.light.tint }}
                  className="text-lg underline"
                >
                  Don't have an account?{" "}
                </Text>
                <Text
                  style={{ color: Colors.light.tint }}
                  className="text-lg font-bold underline  "
                >
                  Register
                </Text>
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
