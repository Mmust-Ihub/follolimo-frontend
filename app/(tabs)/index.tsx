import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "./../../firebase";
import { useContext, useEffect, useState } from "react";
import { screenHeight } from "@/constants/AppDimensions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext"; // For theme management
import WeatherInfo from "../components/index/WeatherInfo";
import MyFarms from "../components/index/MyFarms";
import MyTasks from "../components/index/MyTasks";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import Notify from "../components/Notify";

export default function Index() {
  interface UserData {
    username: string;
    // Add other properties if needed
  }
  interface AlarmData {
    id: string;
    // Add other properties if needed
  }

  const [alarmUsers, setAlarmUsers] = useState<AlarmData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [greetingType, setGreetingType] = useState("Hello");
  const themeContext = useContext(ThemeContext); // Access theme mode
  const isDarkMode = themeContext?.isDarkMode ?? false;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within its provider");
  }
  const { userToken } = authContext;
  // Dynamic theme-based styles
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const router = useRouter();
  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good Morning";
      } else if (currentHour >= 12 && currentHour < 16) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    setGreetingType(getGreeting());
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://fololimo-api-eight.vercel.app/api/v1/users/user/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribe = getResults();
    console.log("unsubscribe", unsubscribe);
    return () => unsubscribe(); // Cleanup function to unsubscribe from real-time updates

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResults = () => {
    const query = collection(db, "Alarms");
    console.log("query", query);
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const alarmsData: AlarmData[] = [];
      snapshot.forEach((doc) => {
        alarmsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setAlarmUsers(alarmsData);
    });

    return unsubscribe;
  };
  console.log("alarmusers " + alarmUsers);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <Notify />
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              style={styles.userImage}
              source={require("@/assets/images/splash.png")}
            />
            <View>
              <Text style={[styles.greetingText, { color: textColor }]}>
                {greetingType}👋,
              </Text>
              <Text style={[styles.usernameText, { color: textColor }]}>
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
        <WeatherInfo textColor={textColor} />

        <MyFarms textColor={textColor} />

        <MyTasks textColor={textColor} />
      </ScrollView>
      <Pressable
        style={styles.Chat}
        onPress={() => router.push("/(modals)/Chat")}
      >
        <Text style={styles.chatText}>Chat with Dr Shamba</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? screenHeight * 0.06 : 0,
    paddingHorizontal: 8,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0.6,
  },
  greetingText: {
    fontWeight: "600",
  },
  usernameText: {
    fontSize: 14,
  },
  scrollViewStyle: {
    gap: 20,
  },
  Chat: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Colors.light.tabIconSelected,
    padding: 10,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.54 },
    shadowOpacity: 0.75,
  },
  chatText: {
    fontSize: 12,
    color: "#fff",
  },
});
