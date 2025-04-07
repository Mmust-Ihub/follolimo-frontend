import { useEffect, useState, useContext, useRef } from "react";
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
import { onSnapshot, collection } from "firebase/firestore";
import NetInfo from "@react-native-community/netinfo";
import { db } from "./../../firebase";
import { screenHeight } from "@/constants/AppDimensions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import WeatherInfo from "../components/index/WeatherInfo";
import MyTasks from "../components/index/MyTasks";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { useNotifications } from "../../hooks/useNotification";
import { Feather } from "@expo/vector-icons";

export default function Index() {
  interface UserData {
    username: string;
    pk: string;
    email: string;
    role: string;
  }

  interface AlarmData {
    id: string;
  }

  const [alarmUsers, setAlarmUsers] = useState<AlarmData[]>([]);
  const [greetingType, setGreetingType] = useState("Hello");
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [justReconnected, setJustReconnected] = useState(false); // ✅ New state

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;

  const authContext = useContext(AuthContext);
  const { userDetails } = authContext || {};
  const userData: UserData | null = userDetails || null;

  const router = useRouter();
  const { expoPushToken, sendPushNotification } = useNotifications();
  const isFirstSnapshot = useRef(true);

  // Greeting
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
        setTimeout(() => setJustReconnected(false), 3000); // ✅ show green banner briefly
      }

      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, [isConnected]);

  // Listen for farm data
  useEffect(() => {
    if (!userData) return;

    const query = collection(db, "fololimo");
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const alarmsData: AlarmData[] = snapshot.docs
        .filter((doc) => doc.data().user_id === userData.pk)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setAlarmUsers(alarmsData);

      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newFarmData = change.doc.data();

            if (!expoPushToken) return;
            if (newFarmData.user_id === userData.pk) {
              const notificationMessage = {
                title: "New Farm Data",
                body: `New data for farm ${newFarmData.farm_id}`,
                farmId: newFarmData.farm_id,
                farmName: newFarmData.farm_name,
                userId: newFarmData.user_id,
                userDataId: userData.pk,
              };

              // Uncomment to enable notifications
              // sendPushNotification(expoPushToken!, notificationMessage);
            }
          }
        });
      }
    });

    return () => unsubscribe();
  }, [expoPushToken, userData]);

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
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userData?.username || ""
                  )}&background=9BA1A6&color=fff`,
                }}
                className="w-12 h-12 rounded-full"
              />
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
              <Text
                style={[
                  styles.usernameText,
                  { color: isDarkMode ? Colors.dark.text : Colors.light.text },
                ]}
              >
                {userData?.username}
              </Text>
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
    color: "#333",
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
});
