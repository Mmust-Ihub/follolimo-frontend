import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useFetch } from "@/contexts/usefetchData";
import useFormat from "@/hooks/useFormat";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "@/contexts/ThemeContext";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import { screenWidth } from "@/constants/AppDimensions";

interface Activity {
  farmId: {
    _id: string;
    name: string;
  };
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ActivityListProps {
  title: string;
  activities: Activity[];
  isLoading: boolean;
  textColor: string;
  emptyMessage: string;
}

const ActivityItem = ({
  farmId,
  title,
  description,
  startDate,
  endDate,
  status,
}: Activity) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ThemeContext must be used within its provider");
  }

  const { isDarkMode } = themeContext;
  const tasksBackgroundColor = isDarkMode
    ? Colors.dark.cardBg
    : Colors.light.cardBg;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const progressColor = isDarkMode ? "#4ade80" : "#22c55e";
  const trackColor = isDarkMode ? "#374151" : "#e5e7eb";

  const { formatDate } = useFormat();
  const router = useRouter();

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const today = dayjs();

  const totalDuration = end.diff(start, "day");
  const progress = Math.min(
    100,
    Math.max(
      0,
      parseFloat(((today.diff(start, "day") / totalDuration) * 100).toFixed(0))
    )
  );

  const remainingDays = start.diff(today, "day");

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/(tabs)/myfarms/[farmdet]/farmdetail`,
          params: { farmdet: farmId?._id, farmName: farmId?.name },
        })
      }
      className="flex-row items-center justify-between p-3 rounded-xl shadow-sm"
      style={{ backgroundColor: tasksBackgroundColor }}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold mb-1" style={{ color: textColor }}>
          {title}
        </Text>
        <Text
          className="text-md font-semibold mb-1"
          style={{ color: textColor }}
        >
          {farmId?.name}
        </Text>
        <Text className="text-sm mb-1" style={{ color: textColor }}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </Text>
        <Text className="text-sm mb-1" style={{ color: textColor }}>
          {description?.slice(0, 100)}...
        </Text>

        {remainingDays > 0 && (
          <Text
            className={`text-md tracking-wide mb-1 font-semibold ${
              remainingDays <= 2 ? "text-[#ef9920]" : "text-[#4ade80]"
            }`}
          >
            Starts in {remainingDays} day{remainingDays > 1 ? "s" : ""}
          </Text>
        )}

        {today.isAfter(start) && today.isBefore(end) && (
          <>
            <View
              className="w-full h-2 rounded-md mt-1 mb-1"
              style={{ backgroundColor: trackColor }}
            >
              <View
                className="h-2 rounded-md"
                style={{
                  backgroundColor: progressColor,
                  width: `${progress}%`,
                }}
              />
            </View>
            <Text className="text-xs text-gray-500">{progress}% complete</Text>
          </>
        )}
      </View>
      <Ionicons name="chevron-forward" size={25} color={textColor} />
    </TouchableOpacity>
  );
};

const ActivityList = ({
  title,
  activities,
  isLoading,
  textColor,
  emptyMessage,
}: ActivityListProps) => {
  const router = useRouter();

  return (
    <View className="mb-2 mt-2 p-2 justify-center">
      <Text className="font-bold text-lg mb-2" style={{ color: textColor }}>
        {title}
      </Text>
      {isLoading ? (
        <View className="gap-2">
          {[...Array(1)].map((_, index) => (
            <ShimmerPlaceholder
              key={index}
              style={{
                width: "100%",
                height: 100,
                borderRadius: 8,
                marginBottom: 10,
              }}
              shimmerStyle={{ borderRadius: 8 }}
              LinearGradient={LinearGradient}
            />
          ))}
        </View>
      ) : activities?.length > 0 ? (
        <View className="gap-2">
          {activities?.map((activity, index) => (
            <ActivityItem
              key={index}
              {...activity}
              status={activity.status || "Unknown"}
            />
          ))}
        </View>
      ) : (
        <View className="flex w-full p-2 ">
          <Text
            className="text-md mt-4 font-bold w-full"
            style={{ color: textColor }}
          >
            {emptyMessage}
          </Text>
          {emptyMessage !== "You have no past activities..." && (
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
                  textDecorationLine: "underline",
                }}
              >
                Create one
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default function MyTasks({ textColor }: { textColor: string }) {
  const { Activity, loading } = useFetch();

  const now = new Date();

  const { upcomingActivities, pastActivities } = useMemo(() => {
    const upcoming: Activity[] = [];
    const past: Activity[] = [];

    Activity?.forEach((activity: Activity) => {
      const end = new Date(activity.endDate);
      if (end >= now) {
        upcoming.push(activity);
      } else {
        past.push(activity);
      }
    });

    return { upcomingActivities: upcoming, pastActivities: past };
  }, [Activity]);

  return (
    <View className="mb-8 mt-2">
      <ActivityList
        title="My Upcoming Activities"
        activities={upcomingActivities}
        isLoading={loading}
        textColor={textColor}
        emptyMessage="You have no upcoming activities..."
      />
      <ActivityList
        title="My Past Activities"
        activities={pastActivities}
        isLoading={loading}
        textColor={textColor}
        emptyMessage="You have no past activities..."
      />
    </View>
  );
}
