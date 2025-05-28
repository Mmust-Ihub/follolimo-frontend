import {
  SectionList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useEffect, useState, useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export default function ChatsListScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts must be used within their providers");
  }

  const { userToken } = authContext;
  const { isDarkMode } = themeContext;

  const activeTintColor = isDarkMode
    ? Colors.dark.tabIconSelected
    : Colors.light.tabIconSelected;
  const inactiveTintColor = isDarkMode
    ? Colors.dark.tabIconDefault
    : Colors.light.tabIconDefault;
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const headerBackgroundColor = isDarkMode
    ? Colors.dark.headerBackground
    : Colors.light.headerBackground;
  const headerTextColor = isDarkMode
    ? Colors.dark.headerText
    : Colors.light.headerText;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_NODEAPI_URL}/ai/chat/`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await res.json();
      console.log("Fetched Chats:", data);

      if (Array.isArray(data)) {
        setChats(data);
      } else {
        console.warn("Fetched chats is not an array:", data);
        setChats([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load chats.");
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("Fetched Chats:", chats);

  const createNewChat = async () => {
    try {
      setCreating(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_NODEAPI_URL}/ai/chat/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Hello",
          }),
        }
      );
      const data = await res.json();
      console.log("Created Chat:", data);

      setChats((prev) => [data, ...prev]);
      // router.push({
      //   pathname: "/(modals)/[chatid]",
      //   params: { chatid: data?.chatId },
      // });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create chat.");
    } finally {
      setCreating(false);
    }
  };

  const groupByDate = (chatList: any[]) => {
    const groups: Record<string, any[]> = {};

    if (!Array.isArray(chatList)) {
      console.warn("chatList is not an array:", chatList);
      return [{ title: "No Chats", data: [] }];
    }

    chatList.forEach((chat) => {
      const date = dayjs(chat.createdAt);
      let label = date.format("DD MMM YYYY");
      if (date.isToday()) label = "Today";
      else if (date.isYesterday()) label = "Yesterday";

      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    });

    const grouped = Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));

    return grouped.length > 0 ? grouped : [{ title: "No Chats", data: [] }];
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: headerBackgroundColor,
        }}
      >
        <Text
          style={{ fontSize: 24, fontWeight: "bold", color: headerTextColor }}
        >
          Chats
        </Text>
        <TouchableOpacity
          onPress={createNewChat}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: activeTintColor,
            borderRadius: 9999,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}
          disabled={creating}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {creating ? "Creating..." : "New Chat"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={activeTintColor} />
        </View>
      ) : (
        <SectionList
          sections={groupByDate(chats)}
          keyExtractor={(item) => item?.chatId}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 8,
                fontSize: 14,
                fontWeight: "600",
                color: inactiveTintColor,
              }}
            >
              {title}
            </Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(modals)/[chatid]",
                  params: { chatid: item?.chatId },
                })
              }
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDarkMode ? "#333" : "#e5e5e5",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: textColor }}
              >
                Chat #{item.chatId?.slice(-4)}
              </Text>
              <Text style={{ color: inactiveTintColor }}>
                {item.lastMsg?.slice(0, 60)}...
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: inactiveTintColor,
                  marginTop: 4,
                }}
              >
                {dayjs(item.createdAt).format("hh:mm A")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: inactiveTintColor }}>
                No chats available yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
