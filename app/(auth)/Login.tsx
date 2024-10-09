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

export default function Login() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  // Get AuthContext and check if it's defined
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }

  const { login } = authContext;
  const handleLogin = () => {
    console.log("Attempting to log in with", username, password);
    if (!username || !password) {
      Alert.alert("All fields are required");
      return;
    }

    login(username, password);
  };
  return (
    <SafeAreaView className="bg-green-900 flex-1">
      <KeyboardAvoidingView className="bg-white flex justify-center items-center h-screen px-4 space-y-6 rounded-lg shadow-lg">
        <Text className="font-extrabold text-xl uppercase text-center text-green-900 mb-4">
          Login To Follolimo
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

        {/* Forgot Password link aligned left under password input */}
        <View className="w-full">
          <TouchableOpacity className="mt-2">
            <Text className="text-green-500 text-sm text-right">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity
          className="bg-green-500 rounded-lg w-full px-4 py-2"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>

        {/* Sign Up link aligned right below the Login button */}
        <View className="w-full flex flex-row justify-start mt-2">
          <TouchableOpacity className="flex flex-row gap-2">
            <Link href="/signup" className="text-green-500 text-sm text-right">
              <Text className=" text-sm">Don't have an account?</Text>
              <Text className="text-green-500 text-md">Sign Up</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
