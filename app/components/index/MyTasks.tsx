import { Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface MyTasksProps {
  textColor: string;
}

export default function MyTasks({ textColor }: MyTasksProps) {
  const router = useRouter()
  const tasks = [
    {
      date: "12 May 2021",
      task: "Maize Planting",
      status: "Completed",
    },
    {
      date: "13 June 2023",
      task: "Weeding",
      status: "Pending",
    },
    {
      date: "14 July 2022",
      task: "Harvesting",
      status: "Pending",
    },
    {
      date: "15 August 2021",
      task: "Fertilizer Application",
      status: "Completed",
    },
    {
      date: "16 September 2021",
      task: "Irrigation",
      status: "Pending",
    },
  ];

  return (
    <View className="mb-8">
      <View className="flex-row justify-between p-2">
        <Text className="font-semibold " style={{ color: textColor }}>
          My Activities
        </Text>
        <Pressable
        onPress={()=> router.replace('/(tabs)/inventory/Calendar')}
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
      </View>
      <View className="gap-3">
        {tasks.map((task, index) => (
          <View
            key={index}
            className="flex-row gap-4 p-2 border-2 rounded-md border-green-500"
          >
            <Text className="p-2 w-[40%] bg-red-500 rounded-md text-white">
              {task.date}
            </Text>
            <View>
              <Text style={{ color: textColor }}>{task.task}</Text>
              <Text
                className={`font-bold ${
                  task.status === "Completed"
                    ? "text-green-500 shadow-green-500"
                    : "text-yellow-500 shadow-yellow-500"
                }`}
              >
                {task.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
