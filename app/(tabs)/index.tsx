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
import { db } from "./../../firebase";
import { screenHeight } from "@/constants/AppDimensions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import WeatherInfo from "../components/index/WeatherInfo";
import MyFarms from "../components/index/MyFarms";
import MyTasks from "../components/index/MyTasks";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { useNotifications } from "../../hooks/useNotification"; // Custom hook for notifications

export default function Index() {
  interface UserData {
    username: string;
    pk: string;
  }
  interface AlarmData {
    id: string;
  }

  const [alarmUsers, setAlarmUsers] = useState<AlarmData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [greetingType, setGreetingType] = useState("Hello");
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;

  const authContext = useContext(AuthContext);
  const { userToken } = authContext || {};

  const router = useRouter();

  // Custom hook for notifications
  const { expoPushToken, sendPushNotification } = useNotifications();

  // Ref to track initial snapshot to prevent sending notifications on load
  const isFirstSnapshot = useRef(true);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return "Good Morning";
      if (currentHour >= 12 && currentHour < 16) return "Good Afternoon";
      return "Good Evening";
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
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userToken]);

  useEffect(() => {
    if (!userData) return; // Wait until the user data is loaded

    const query = collection(db, "fololimo");
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const alarmsData: AlarmData[] = snapshot.docs
        .filter((doc) => doc.data().user_id === userData.pk) // Filter by user_id
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

            const notificationMessage = {
              title: "New Farm Data",
              body: `New data for farm ${newFarmData.farm_id}`, // Notification body
              farmId: newFarmData.farm_id, // Send the farm ID
            };

            // Send notification using the custom hook's function
            sendPushNotification(expoPushToken!, notificationMessage);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [expoPushToken, userData]); // Depend on userData so that it triggers when userData is available

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
      <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              style={styles.userImage}
              source={require("@/assets/images/splash.png")}
            />
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
        <MyFarms
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
    paddingTop: Platform.OS === "android" ? screenHeight * 0.06 : 0,
    paddingHorizontal: 15,
  },
  scrollViewStyle: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },
  greetingText: {
    fontSize: 14,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "500",
  },
  Chat: {
    width: 70, // Make width and height equal for a circular button
    height: 70,
    borderRadius: 35, // Half of the width/height to make it circular
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.tint,
    position: "absolute", // Optional: to fix its position on the screen
    bottom: 30, // Adjust positioning as needed
    right: 30,
  },
  chatText: {
    color: "white",
    fontSize: 12, // Adjust font size for circular button
    textAlign: "center", // Center the text
  },
});
