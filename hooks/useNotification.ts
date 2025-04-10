// import { useState, useEffect, useRef } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { Platform } from "react-native";

// // Set global notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// async function registerForPushNotificationsAsync() {
//   if (!Device.isDevice) {
//     throw new Error("Must use physical device for push notifications");
//   }

//   // Android: setup notification channel
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") {
//     throw new Error(
//       "Permission not granted to get push token for notifications!"
//     );
//   }

//   // ✅ Make sure your app.json has the projectId under expo.projectId
//   const projectId =
//     Constants?.expoConfig?.extra?.eas?.projectId ??
//     Constants?.easConfig?.projectId;

//   if (!projectId) {
//     throw new Error("Project ID not found! Make sure it's set in app.json");
//   }

//   const pushToken = (await Notifications.getExpoPushTokenAsync({ projectId }))
//     .data;
//   return pushToken;
// }

// export function useNotifications() {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

//   useEffect(() => {
//     // Register and get token
//     registerForPushNotificationsAsync()
//       .then((token) => {
//         console.log("Expo push token:", token);
//         setExpoPushToken(token);
//       })
//       .catch((error) =>
//         console.error("Failed to register for notifications:", error)
//       );

//     // Foreground notification received
//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log("Notification received in foreground:", notification);
//       });

//     // Notification response (when tapped)
//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log("Notification response received:", response);
//       });

//     return () => {
//       if (notificationListener.current) {
//         Notifications.removeNotificationSubscription(
//           notificationListener.current
//         );
//       }
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }
//     };
//   }, []);

//   return { expoPushToken };
// }

import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
type PushTokenHookReturn = {
  expoPushToken: string | null;
  errorMsg: string | null;
  isLoading: boolean;
};

export function usePushNotificationToken(): PushTokenHookReturn {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      setIsLoading(true);
      if (Device.isDevice) {
        try {
          // Check for permissions
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          // Request permissions if not already granted
          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus !== "granted") {
            setErrorMsg("Permission to receive notifications was denied");
            setIsLoading(false);
            return;
          }

          const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
          if (!projectId) {
            handleRegistrationError("Project ID not found");
          }

          // Get the push token
          const { data: token } = await Notifications.getExpoPushTokenAsync({
            projectId,
          });
          if (token) {
            setExpoPushToken(token!);
          }

          // For Android: Set notification channel
          if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
              name: "default",
              importance: Notifications.AndroidImportance.MAX,
            });
          }
        } catch (error) {
          console.error("Error fetching push token:", error);
          setErrorMsg(
            "An error occurred while fetching the push token " + error
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setErrorMsg("Must use physical device for Push Notifications");
        setIsLoading(false);
      }
    }

    registerForPushNotificationsAsync();
  }, []);

  return { expoPushToken, errorMsg, isLoading };
}
