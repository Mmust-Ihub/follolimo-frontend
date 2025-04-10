// import { View, Text } from 'react-native'
// import React, { useContext } from 'react'
// import { AuthContext } from '@/contexts/AuthContext';
// import { Colors } from '@/constants/Colors';
// import { ThemeContext } from '@/contexts/ThemeContext';

// const Page = () => {
//    const authContext = useContext(AuthContext);
//    const themeContext = useContext(ThemeContext);

//    if (!authContext || !themeContext) {
//      throw new Error(
//        "AuthContext, OnboardingContext, and ThemeContext must be used within their providers"
//      );
//    }

//    const { userToken, isLoading: isAuthLoading } = authContext;
//    const { isDarkMode } = themeContext;

//    // Set theme-based colors
//    const activeTintColor = isDarkMode
//      ? Colors.dark.tabIconSelected
//      : Colors.light.tabIconSelected;
//    const inactiveTintColor = isDarkMode
//      ? Colors.dark.tabIconDefault
//      : Colors.light.tabIconDefault;
//    const backgroundColor = isDarkMode
//      ? Colors.dark.background
//      : Colors.light.background;
//    const headerBackgroundColor = isDarkMode
//      ? Colors.dark.headerBackground
//      : Colors.light.headerBackground;
//    const headerTextColor = isDarkMode
//      ? Colors.dark.headerText
//      : Colors.light.headerText;
//    const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
//   return (
//     <View>
//       <Text>Page</Text>
//     </View>
//   )
// }

// export default Page

// screens/ChatsListScreen.tsx
import { FlatList, TouchableOpacity, Text, View } from "react-native";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";

export default function ChatsListScreen() {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  if (!AuthContext || !ThemeContext) {
    throw new Error(
      "AuthContext, OnboardingContext, and ThemeContext must be used within their providers"
    );
  }

  useEffect(() => {
    fetch("https://fololimo.vercel.app/api/ai/chat/", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then(setChats)
      .catch(console.error);
  }, []);

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.chatId}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChatScreen", { chatId: item.chatId })
          }
          className="p-4 border-b border-gray-300"
        >
          <Text className="font-bold text-lg">
            Chat #{item.chatId.slice(-4)}
          </Text>
          <Text className="text-gray-600">{item.lastMsg}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
