// import { ActivityIndicator, Pressable, Text, View } from "react-native";
// import React, { useEffect } from "react";
// import { Colors } from "@/constants/Colors";
// import { useRouter } from "expo-router";
// import { useFetch } from "@/contexts/usefetchData";
// import useFormat from "@/hooks/useFormat";

// interface Activity {
//   farmId: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   status: string;
// }

// interface ActivityListProps {
//   title: string;
//   activities: Activity[];
//   isLoading: boolean;
//   textColor: string;
//   emptyMessage: string;
// }

// const ActivityItem = ({
//   farmId,
//   title,
//   description,
//   startDate,
//   endDate,
//   status,
// }: Activity) => {
//   const { formatDate } = useFormat();
//   return (
//     <View className="flex-col gap-1 p-2 border rounded-md shadow-sm border-gray-200">
//       <Text className="text-lg font-bold">{title}</Text>
//       <Text className="rounded-md text-sm">
//         {formatDate(startDate)} - {formatDate(endDate)}
//       </Text>
//       <Text className="text-sm">{description?.slice(0, 100)}...</Text>
//       <Text
//         className={`font-bold ${
//           status === "Completed" ? "text-green-500" : "text-yellow-500"
//         }`}
//       >
//         {status.toLocaleLowerCase()}
//       </Text>
//     </View>
//   );
// };

// const ActivityList = ({
//   title,
//   activities,
//   isLoading,
//   textColor,
//   emptyMessage,
// }: ActivityListProps) => {
//   const router = useRouter();

//   return (
//     <View className="mb-2 mt-2 p-4">
//       <Text className="font-bold text-lg mb-2" style={{ color: textColor }}>
//         {title}
//       </Text>
//       {isLoading ? (
//         <View className="w-screen flex flex-col justify-center items-center">
//           <ActivityIndicator size="large" color={Colors.light.tint} />
//           <Text
//             style={{ color: textColor }}
//             className="text-lg mt-4 w-full text-center"
//           >
//             Loading...
//           </Text>
//         </View>
//       ) : activities.length > 0 ? (
//         <View className="gap-2">
//           {activities.map((activity, index) => (
//             <ActivityItem
//               key={index}
//               {...activity}
//               status={activity.status || "Unknown"}
//             />
//           ))}
//         </View>
//       ) : (
//         <View className="flex w-screen p-2">
//           <Text
//             className="text-md mt-4 font-bold w-full"
//             style={{ color: textColor }}
//           >
//             {emptyMessage}
//           </Text>
//           <Pressable
//             onPress={() => router.replace("/(tabs)/inventory/MyFarms")}
//           >
//             <Text
//               className="text-lg font-bold text-center"
//               style={{
//                 color: Colors.light.tabIconSelected,
//                 textDecorationLine: "underline",
//               }}
//             >
//               Create one
//             </Text>
//           </Pressable>
//         </View>
//       )}
//     </View>
//   );
// };

// export default function MyTasks({ textColor }: { textColor: string }) {
//   const {
//     fetchFarms,
//     fetchPastActivities,
//     fetchUpcomingActivities,
//     upComingActivity,
//     pastActivities,
//     isPastActivitiesLoading,
//     isUpcomingActivitiesLoading,
//   } = useFetch();

//   useEffect(() => {
//     fetchFarms();
//     fetchPastActivities();
//     fetchUpcomingActivities();
//   }, []);

//   return (
//     <View className="mb-8 mt-2">
//       <ActivityList
//         title="My Upcoming Activities"
//         activities={upComingActivity.map((activity) => ({
//           ...activity,
//           status: activity.status || "Unknown",
//         }))}
//         isLoading={isUpcomingActivitiesLoading}
//         textColor={textColor}
//         emptyMessage="You have no upcoming activities..."
//       />
//       <ActivityList
//         title="My Past Activities"
//         activities={pastActivities.map((activity) => ({
//           ...activity,
//           status: activity.status || "Unknown",
//         }))}
//         isLoading={isPastActivitiesLoading}
//         textColor={textColor}
//         emptyMessage="You have no past activities..."
//       />
//     </View>
//   );
// }

import { ActivityIndicator, Pressable, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useFetch } from "@/contexts/usefetchData";
import useFormat from "@/hooks/useFormat";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "@/contexts/ThemeContext";

interface Activity {
  id: string;
  farm: string;
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
  id,
  farm,
  title,
  description,
  startDate,
  endDate,
  status,
}: Activity) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error(
      "AuthContext, OnboardingContext, and ThemeContext must be used within their providers"
    );
  }

  const { isDarkMode } = themeContext;
  const tasksBackgroundColor = isDarkMode
    ? Colors.dark.cardBg
    : Colors.light.cardBg;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const { formatDate } = useFormat();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/myfarms/[farmdet]/farmdetail",
          params: { id: id, farmName: farm },
        })
      }
      className="flex-row items-center justify-between p-2 rounded-md shadow-sm"
      style={{ backgroundColor: tasksBackgroundColor }}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold" style={{ color: textColor }}>
          {title}
        </Text>
        <Text className="text-sm" style={{ color: textColor }}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </Text>
        <Text className="text-sm" style={{ color: textColor }}>
          {description?.slice(0, 100)}...
        </Text>
        <Text
          className={`font-bold ${
            status === "Completed" ? "text-green-500" : "text-yellow-500"
          }`}
        >
          {status?.toLocaleLowerCase()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.tint} />
    </Pressable>
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
    <View className="mb-2 mt-2 p-4">
      <Text className="font-bold text-lg mb-2" style={{ color: textColor }}>
        {title}
      </Text>
      {isLoading ? (
        <View className="w-screen flex flex-col justify-center items-center">
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text
            style={{ color: textColor }}
            className="text-lg mt-4 w-full text-center"
          >
            Loading...
          </Text>
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
        <View className="flex w-screen p-2">
          <Text
            className="text-md mt-4 font-bold w-full"
            style={{ color: textColor }}
          >
            {emptyMessage}
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/inventory/MyFarms")}
          >
            <Text
              className="text-lg font-bold text-center"
              style={{
                color: Colors.light.tabIconSelected,
                textDecorationLine: "underline",
              }}
            >
              Create one
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default function MyTasks({ textColor }: { textColor: string }) {
  const {
    fetchFarms,
    fetchPastActivities,
    fetchUpcomingActivities,
    upComingActivity,
    pastActivities,
    isPastActivitiesLoading,
    isUpcomingActivitiesLoading,
  } = useFetch();

  useEffect(() => {
    fetchFarms();
    fetchPastActivities();
    fetchUpcomingActivities();
  }, []);

  console.log("upComingActivity", upComingActivity);

  return (
    <View className="mb-8 mt-2">
      <ActivityList
        title="My Upcoming Activities"
        activities={upComingActivity?.map((activity) => ({
          ...activity,
          status: activity?.status || "Unknown",
        }))}
        isLoading={isUpcomingActivitiesLoading}
        textColor={textColor}
        emptyMessage="You have no upcoming activities..."
      />
      <ActivityList
        title="My Past Activities"
        activities={pastActivities?.map((activity) => ({
          ...activity,
          status: activity?.status || "Unknown",
        }))}
        isLoading={isPastActivitiesLoading}
        textColor={textColor}
        emptyMessage="You have no past activities..."
      />
    </View>
  );
}
