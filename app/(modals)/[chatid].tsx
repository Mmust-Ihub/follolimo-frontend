import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import { useContext, useEffect, useRef, useState, memo } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Colors } from "@/constants/Colors";

const ChatMessage = memo(
  ({
    role,
    content,
    userMessageBg,
    modelMessageBg,
    textColor,
  }: {
    role: string;
    content: string;
    userMessageBg: string;
    modelMessageBg: string;
    textColor: string;
  }) => {
    return (
      <View
        style={{
          alignSelf: role === "user" ? "flex-end" : "flex-start",
          backgroundColor: role === "user" ? userMessageBg : modelMessageBg,
          padding: 12,
          borderRadius: 10,
          marginBottom: 8,
          maxWidth: "80%",
        }}
      >
        <Markdown
          style={{
            body: { color: textColor, fontSize: 16 },
            link: { color: "#3B82F6" },
            strong: { fontWeight: "bold" },
          }}
        >
          {content}
        </Markdown>
      </View>
    );
  }
);

export default function ChatScreen() {
  const { chatid: chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlashList<any>>(null);

  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts must be used within their providers");
  }

  const { userToken } = authContext;
  const { isDarkMode } = themeContext;

  // Set theme-based colors
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
  const userChatBgColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;

  const userMessageBg = isDarkMode ? "#1E40AF" : "#BFDBFE";
  const modelMessageBg = isDarkMode ? "#374151" : "#E5E7EB";

  const inputBgColor = isDarkMode ? "#1F2937" : "#F9FAFB";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_NODEAPI_URL}/ai/chat/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const data = await res.json();
        const parsedMessages = data?.history?.map((msg: any) => ({
          role: msg?.role === "model" ? "assistant" : msg.role,
          content: msg?.parts[0]?.text ?? "",
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    Keyboard.dismiss();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_NODEAPI_URL}/ai/chat/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ chatId, message: input }),
        }
      );

      const newMessage = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: newMessage.modelMessage },
      ]);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        200
      );
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };
  //   useEffect for title
  const navigation = useNavigation();
  useEffect(() => {
    const title =
      messages?.length > 0 ? messages[messages?.length - 1]?.content : "Chat";
    navigation.setOptions({ title });
  }, [messages, navigation]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlashList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        estimatedItemSize={80}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ChatMessage
            role={item.role}
            content={item.content}
            userMessageBg={userChatBgColor}
            modelMessageBg={modelMessageBg}
            textColor={textColor}
          />
        )}
      />

      {loading && (
        <View style={{ padding: 10, alignItems: "center" }}>
          <ActivityIndicator size="small" color={textColor} />
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: isDarkMode ? "#333" : "#ccc",
          backgroundColor,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? "#111" : "#aaa"}
          style={{
            flex: 1,
            backgroundColor: modelMessageBg,
            color: textColor,
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            marginLeft: 8,
            backgroundColor: userChatBgColor,
            padding: 8,
            borderRadius: 999,
          }}
        >
          <Pressable onPress={sendMessage} disabled={loading}>
            <Ionicons name="send" size={24} color={"white"} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
