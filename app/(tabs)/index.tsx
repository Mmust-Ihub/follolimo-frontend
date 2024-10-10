import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { screenHeight } from "@/constants/AppDimensions";
import { Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import WeatherInfo from "../components/index/WeatherInfo";
import MyFarms from "../components/index/MyFarms";
import MyTasks from "../components/index/MyTasks";

export default function Index() {
  const [greetingType, setGreetingType] = useState("Hello");

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
    console.log("greetingType", getGreeting());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row  items-center justify-between">
        <View className="flex-row gap-3 justify-start items-center">
          <Image
            style={styles.userImage}
            source={require("@/assets/images/splash.png")}
          />
          <View>
            <Text className="font-semibold">{greetingType}👋,</Text>
            <Text>Muchael123</Text>
          </View>
        </View>
        <View className="relative ">
          <MaterialIcons
            name="notifications-on"
            size={28}
            color={Colors.light.tabIconSelected}
          />
        </View>
      </View>
      <WeatherInfo />
      <ScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <MyFarms />
        <MyTasks />
      </ScrollView>
      <Pressable style={styles.Chat}>
        <Text className="text-xs text-white">Chat with Dr Shamba</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? screenHeight*.06 : 0,
    paddingHorizontal: 20,
    gap: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    objectFit: "cover",
    shadowColor: "#000",
    left: -8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: .6,
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
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    elevation: 5,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.54,
    },
    shadowOpacity: 0.75,
  },
})
