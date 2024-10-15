import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { useFetch } from "@/contexts/usefetchData";

interface MyTasksProps {
  textColor: string;
}
// "activity": "Planting",
// "date": "2024-10-25",
// "cost": 20000.0,
// "duration": 12,
// "status":"pending",
// "id": 1,
// "farm": "Kariosh"

export default function MyTasks({ textColor }: MyTasksProps) {
  const {
    tasks,

    loading,

    fetchTasks,
  } = useFetch();
  useEffect(() => {
    fetchTasks();
  }, []);

  const router = useRouter();

  return (
    <View className="mb-8">
      <View className="flex-row justify-between p-2">
        <Text className="font-semibold " style={{ color: textColor }}>
          My Activities
        </Text>
        {tasks && (
          <Pressable
            onPress={() => router.replace("/(tabs)/inventory/Calendar")}
          >
            <Text
              style={{
                color: Colors.light.tabIconSelected,
                textDecorationLine: "underline",
              }}
            >
              View all
            </Text>
          </Pressable>
        )}
      </View>
      {loading ? (
        <View className="w-screen flex flex-col justify-center items-center">
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text
            style={{ color: textColor }}
            className="text-lg mt-4 w-full text-center"
          >
            Loading...
          </Text>
        </View>
      ) : tasks.length > 0 ? (
        <View className="gap-3">
          {tasks.map(
            ({ activity, date, status, cost, farm, duration }, index) => (
              <View
                key={index}
                className="flex-row gap-4 p-2 border-2 rounded-md border-green-500"
              >
                <Text className="p-2 w-[40%] bg-red-500 rounded-md text-white">
                  {farm?.slice(0, 15)}...
                  {date}
                </Text>
                <View>
                  <Text style={{ color: textColor }}>{activity}</Text>
                  <Text
                    className={`font-bold ${
                      status === "Completed"
                        ? "text-green-500 shadow-green-500"
                        : "text-yellow-500 shadow-yellow-500"
                    }`}
                  >
                    {status}
                  </Text>
                  <Text style={{ color: textColor }}>Cost: Ksh {cost}</Text>
                </View>
                <Text style={{ color: textColor }}>{duration} days</Text>
              </View>
            )
          )}
        </View>
      ) : (
        <View className="flex  items-center justify-center w-screen">
          <Text
            className="text-lg font-bold  text-center"
            style={{ color: textColor }}
          >
            You have no tasks...
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/inventory/MyFarms")}
          >
            <Text
              style={{
                color: Colors.light.tabIconSelected,
                textDecorationLine: "underline",
              }}
              className="text-lg font-bold  text-center"
            >
              Create one{" "}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
