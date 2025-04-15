import { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { screenHeight, screenWidth } from "@/constants/AppDimensions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import WeatherInfo from "../components/index/WeatherInfo";
import MyTasks from "../components/index/MyTasks";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { usePushNotificationToken } from "../../hooks/useNotification";
import { Feather } from "@expo/vector-icons";
import { useFetch } from "@/contexts/usefetchData";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { it } from "node:test";

export default function Index() {
  interface UserData {
    username: string;
    pk: string;
    email: string;
    role: string;
  }

  const { errorMsg } = usePushNotificationToken();
  console.log("errorMsg", errorMsg);

  const [greetingType, setGreetingType] = useState("Hello");
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [justReconnected, setJustReconnected] = useState(false); // ✅ New state

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;

  const authContext = useContext(AuthContext);
  const { userDetails, isLoading } = authContext || {};
  const userData: UserData | null = userDetails || null;

  const router = useRouter();
  const { fetchFarms, transactionData, loading } = useFetch();
  console.log("TransactionData", transactionData);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return "Good Morning";
      if (currentHour >= 12 && currentHour < 16) return "Good Afternoon";
      return "Good Evening";
    };
    setGreetingType(getGreeting());
  }, []);

  // Network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;

      if (!isConnected && connected) {
        setJustReconnected(true);
        fetchFarms(); // Re-fetch farms when reconnected
        setTimeout(() => setJustReconnected(false), 3000);
      }

      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, [isConnected]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      {/* Offline Banner */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Feather name="wifi-off" size={24} color="black" />
          <Text style={styles.offlineText}>You're offline</Text>
        </View>
      )}

      {/* Online Banner*/}
      {justReconnected && (
        <View style={styles.onlineBanner}>
          <Feather name="wifi" size={24} color="white" />
          <Text style={styles.onlineText}>You're back online</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View className="py-1">
              {/* shimmer when loading */}
              {isLoading ? (
                <ShimmerPlaceholder
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  visible={false}
                  shimmerStyle={{ backgroundColor: "#ccc" }}
                  shimmerColors={["#ccc", "#ddd", "#eee"]}
                  duration={1000}
                  LinearGradient={LinearGradient}
                />
              ) : (
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData?.username || ""
                    )}&background=9BA1A6&color=fff`,
                  }}
                  className="w-12 h-12 rounded-full"
                />
              )}
            </View>

            <View>
              <Text
                style={[
                  styles.greetingText,
                  { color: isDarkMode ? Colors.dark.text : Colors.light.text },
                ]}
              >
                {greetingType}👋,
              </Text>
              {isLoading ? (
                <ShimmerPlaceholder
                  style={{ width: 150, height: 20 }}
                  visible={false}
                  shimmerStyle={{ backgroundColor: "#ccc" }}
                  shimmerColors={["#ccc", "#ddd", "#eee"]}
                  duration={1000}
                  LinearGradient={LinearGradient}
                />
              ) : (
                <Text
                  style={[
                    styles.usernameText,
                    {
                      color: isDarkMode ? Colors.dark.text : Colors.light.text,
                    },
                  ]}
                >
                  {userData?.username}
                </Text>
              )}
            </View>
          </View>

          <MaterialIcons
            name="notifications-on"
            size={28}
            color={Colors.light.tabIconSelected}
          />
        </View>

        <WeatherInfo
          textColor={isDarkMode ? Colors.dark.text : Colors.light.text}
        />

        <Text
          style={[
            styles.greetingText,
            {
              fontSize: 18,
              fontWeight: "700",
              marginTop: 5,
              color: isDarkMode ? Colors.dark.text : Colors.light.text,
            },
          ]}
        >
          My spending
        </Text>

        <View style={styles.transactionSummary}>
          {loading ? (
            <ShimmerPlaceholder
              style={styles.transactionCard}
              visible={false}
              shimmerStyle={{ backgroundColor: "#ccc", borderRadius: 10 }}
              shimmerColors={["#ccc", "#ddd", "#eee"]}
              duration={1000}
              LinearGradient={LinearGradient}
            />
          ) : (transactionData ?? []).length > 0 ? (
            transactionData?.map((item: any) => (
              <View
                key={item._id}
                style={[
                  styles.transactionCard,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.dark.cardBg
                      : Colors.light.cardBg,
                    shadowColor: isDarkMode ? "#000" : "#ccc",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.transactionLabel,
                    {
                      color: isDarkMode ? Colors.dark.text : Colors.light.text,
                    },
                  ]}
                >
                  {item._id === "income" ? "Total Income" : "Total Expense"}
                </Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        item._id === "income"
                          ? Colors.linearGreen
                          : Colors.orange,
                    },
                  ]}
                >
                  {item._id === "income" ? "+ KES " : "- KES "} {item.total}
                </Text>
              </View>
            ))
          ) : (
            <View>
              <Text
                style={[
                  styles.transactionLabel,
                  { color: isDarkMode ? Colors.dark.text : Colors.light.text },
                ]}
              >
                No transactions available
              </Text>
              <Pressable
                onPress={() => router.replace("/(tabs)/myfarms")}
                style={{
                  backgroundColor: "#22c55e",
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  width: screenWidth * 0.8,
                }}
              >
                <Text
                  className="text-lg font-bold text-center"
                  style={{
                    color: "white",
                  }}
                >
                  Add one
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <MyTasks
          textColor={isDarkMode ? Colors.dark.text : Colors.light.text}
        />
      </ScrollView>

      <Pressable
        style={styles.Chat}
        onPress={() => router.push("/(modals)/Chat")}
      >
        <Text style={styles.chatText}>Talk to Dr Shamba</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? screenHeight * 0.04 : 0,
    paddingHorizontal: 15,
  },
  scrollViewStyle: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "700",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  Chat: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.tint,
    position: "absolute",
    bottom: 30,
    right: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: Colors.light.tabIconSelected,
    overflow: "hidden",
  },
  chatText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  offlineBanner: {
    backgroundColor: "#ffcccb",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  offlineText: {
    color: "#222",
    fontWeight: "bold",
  },
  onlineBanner: {
    backgroundColor: "#4CAF50", // Green
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  onlineText: {
    color: "white",
    fontWeight: "bold",
  },
  transactionSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 0,
    marginTop: 5,
  },
  transactionCard: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
    height: 100,
  },
  transactionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    color: "#111",
  },
});
