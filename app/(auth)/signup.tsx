import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // Use Ionicons from @expo/vector-icons
import { Link } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Get AuthContext and check if it's defined
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not available");
  }

  const { register } = authContext;

  const handleSubmit = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTest.test(email)) {
      Alert.alert("Invalid email address");
      return;
    }
    console.log("Registering with", username);

    register(email, username, password, confirmPassword);
  };
  const tooglePasswordField = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <SafeAreaView className="bg-green-900 flex-1">
      <KeyboardAvoidingView className="bg-white flex justify-center items-center h-screen px-4 space-y-6 rounded-lg shadow-lg">
        <Text className="font-extrabold text-xl uppercase text-center text-green-900 mb-4">
          Register To Follolimo
        </Text>

        {/* Username input with icon */}
        <View className="border border-green-500 rounded-lg w-full flex flex-row items-center px-4 py-2">
          <Ionicons name="person-outline" size={20} color="#A3A3A3" />
          <TextInput
            onChange={(e) => setUsername(e.nativeEvent.text)}
            className="ml-2 flex-1"
            placeholder="Username..."
            placeholderTextColor="#A3A3A3"
          />
        </View>
        {/* email input with icon */}
        <View className="border border-green-500 rounded-lg w-full flex flex-row items-center px-4 py-2">
          <Ionicons name="person-outline" size={20} color="#A3A3A3" />
          <TextInput
            onChange={(e) => setEmail(e.nativeEvent.text)}
            className="ml-2 flex-1"
            placeholder="email..."
            placeholderTextColor="#A3A3A3"
          />
        </View>

        {/* Password input with icon */}
        <View className="border border-green-500 rounded-lg w-full flex flex-row items-center px-4 py-2">
          <Ionicons name="lock-closed-outline" size={20} color="#A3A3A3" />
          <TextInput
            onChange={(e) => setPassword(e.nativeEvent.text)}
            secureTextEntry
            className="ml-2 flex-1"
            placeholder="Password..."
            placeholderTextColor="#A3A3A3"
          />
        </View>
        <View className="border border-green-500 rounded-lg w-full flex flex-row items-center px-4 py-2">
          <Ionicons name="lock-closed-outline" size={20} color="#A3A3A3" />
          <TextInput
            onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
            secureTextEntry
            className="ml-2 flex-1"
            placeholder="Comfirm Password..."
            placeholderTextColor="#A3A3A3"
          />
        </View>

        {/* Login button */}
        <TouchableOpacity
          className="bg-green-500 rounded-lg w-full px-4 py-2"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Register</Text>
        </TouchableOpacity>

        {/* Sign Up link aligned right below the Login button */}
        <View className="w-full flex flex-row justify-start mt-2">
          <TouchableOpacity className="flex flex-row gap-2">
            <Link
              href="/(auth)/Login"
              className="text-green-500 text-sm text-right"
            >
              <Text className=" text-sm">Already have an account?</Text>
              <Text className="text-green-500 text-md">Login</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
