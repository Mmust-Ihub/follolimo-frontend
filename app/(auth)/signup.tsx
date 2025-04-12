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
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useContext, useState, useRef } from "react";
import Modal from "react-native-modal";
import { Feather, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import SmoothHeaderCurve from "../components/SmoothHeaderCurve";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [step, setStep] = useState(1);

  const scrollRef = useRef<ScrollView>(null);

  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts not found");
  }

  const { isDarkMode } = themeContext;
  const { register, isAutLoading } = authContext;

  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const inputBorderColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const iconColor = isDarkMode ? Colors.dark.icon : Colors.light.icon;

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

    if (firstName.trim().length < 3 || lastName.trim().length < 3) {
      setModalMessage("Names must be at least 3 characters long");
      setIsModalVisible(true);
      return;
    }

    const nameTest = /^[a-zA-Z]+$/;
    if (!nameTest.test(firstName.trim()) || !nameTest.test(lastName.trim())) {
      setModalMessage("Names must not contain numbers or special characters");
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
        "Password must contain at least 8 characters, one uppercase, one lowercase, and one number"
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

  const goNext = () => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !username.trim()) {
        setModalMessage("All fields on Step 1 are required.");
        setIsModalVisible(true);
        return;
      }
      setStep(2);
      scrollRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: true });
    } else if (step === 2) {
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        setModalMessage("All fields on Step 2 are required.");
        setIsModalVisible(true);
        return;
      }
      handleSubmit();
    }
  };

  const goPrevious = () => {
    if (step === 2) {
      setStep(1);
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor }} className="flex-1">
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="#22c55a"
      />
      <SmoothHeaderCurve />

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Prevent manual swipe
      >
        {/* Step 1 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-screen px-6 justify-center items-center h-screen space-y-6 gap-4"
        >
          <Text
            className="text-xl font-extrabold uppercase text-center mb-4"
            style={{ color: textColor }}
          >
            Register To Fololimo
          </Text>
          {/* steps */}
          <View className="w-full flex flex-row justify-between mb-4">
            <Text
              className={`text-lg font-bold ${
                step === 1 ? "text-green-500" : "text-gray-500"
              }`}
            >
              Step 1
            </Text>
            <Text
              className={`text-lg font-bold ${
                step === 2 ? "text-green-500" : "text-gray-500"
              }`}
            >
              Step 2
            </Text>
          </View>

          {/* Firstname */}
          <View className="w-full">
            <Text style={{ color: textColor }} className="font-bold">
              Firstname
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg flex-row items-center px-4 py-2"
            >
              <Ionicons name="person-outline" size={20} color={iconColor} />
              <TextInput
                placeholder="Firstname..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                className="ml-2 flex-1"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          {/* Lastname */}
          <View className="w-full">
            <Text style={{ color: textColor }} className="font-bold">
              Lastname
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg flex-row items-center px-4 py-2"
            >
              <Ionicons name="person-outline" size={20} color={iconColor} />
              <TextInput
                placeholder="Lastname..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                className="ml-2 flex-1"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Username */}
          <View className="w-full">
            <Text style={{ color: textColor }} className="font-bold">
              Username
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="person-circle-outline"
                size={20}
                color={iconColor}
              />
              <TextInput
                placeholder="Username..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                className="ml-2 flex-1"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-gray-500 px-8 py-3 rounded-xl flex-row items-center mt-4"
            onPress={goNext}
          >
            <View className="text-white font-semibold text-center items-center justify-center flex-row">
              <Text className="text-white font-semibold">Next</Text>
              <Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#fff"
                />
              </Text>
            </View>
          </TouchableOpacity>

          <View className="w-full flex flex-row justify-center mt-2">
            <TouchableOpacity
              className="flex flex-row justify-center items-center"
              onPress={() => router.replace("/(auth)/Login")}
            >
              <Text
                style={{ color: Colors.light.tint }}
                className="text-lg underline text-center"
              >
                Already have an account?{" "}
              </Text>
              <Text
                style={{ color: Colors.light.tint }}
                className="text-lg font-bold underline  "
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Step 2 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-screen px-6 justify-center items-center h-screen space-y-6 gap-4"
        >
          {/* steps */}
          <View className="w-full flex flex-row justify-between mb-4">
            <Text
              className={`text-lg font-bold ${
                step === 1 ? "text-green-500" : "text-gray-500"
              }`}
            >
              Step 1
            </Text>
            <Text
              className={`text-lg font-bold ${
                step === 2 ? "text-green-500" : "text-gray-500"
              }`}
            >
              Step 2
            </Text>
          </View>
          {/* Email */}
          <View className="w-full">
            <Text style={{ color: textColor }} className="font-bold">
              Email
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg flex-row items-center px-4 py-2"
            >
              <Ionicons name="mail-outline" size={20} color={iconColor} />
              <TextInput
                placeholder="Email..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                className="ml-2 flex-1"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View className="w-full">
            <Text style={{ color: textColor }} className="font-bold">
              Password
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={iconColor}
              />
              <TextInput
                placeholder="Password..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                className="ml-2 flex-1"
                secureTextEntry={!isOpen}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={handleOpen}>
                <Feather
                  name={isOpen ? "eye" : "eye-off"}
                  size={20}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="w-full">
            <Text style={{ color: textColor }} className="font-bold">
              Confirm Password
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={iconColor}
              />
              <TextInput
                placeholder="Confirm Password..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
                className="ml-2 flex-1"
                secureTextEntry={!isCOpen}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={handleCOpen}>
                <Feather
                  name={isCOpen ? "eye" : "eye-off"}
                  size={20}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Button Row */}
          <View className="flex-row space-x-4 mt-4 gap-4 w-full justify-between">
            <TouchableOpacity
              className="bg-gray-500 px-8 py-3 rounded-xl flex-row items-center"
              onPress={goPrevious}
            >
              <Text className="text-white font-semibold">
                <Ionicons name="chevron-back-outline" size={20} color="#fff" />
              </Text>
              <Text className="text-white font-semibold">Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-500 px-8 py-3 rounded-xl "
              onPress={goNext}
            >
              {isAutLoading ? (
                <View className="flex flex-row justify-center items-center gap-2">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white text-center font-bold">
                    Registering...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-center">
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up link */}
          <View className="w-full flex flex-row justify-center items-center mt-2">
            <TouchableOpacity
              className="flex flex-row justify-center items-center"
              onPress={() => router.replace("/(auth)/Login")}
            >
              <Text
                style={{ color: Colors.light.tint }}
                className="text-lg underline text-center"
              >
                Already have an account?{" "}
              </Text>
              <Text
                style={{ color: Colors.light.tint }}
                className="text-lg font-bold underline"
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

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
