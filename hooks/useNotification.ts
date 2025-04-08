import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { router, useRouter } from "expo-router";
import * as Linking from "expo-linking";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      throw new Error(
        "Permission not granted to get push token for notifications!"
      );
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error("Project ID not found!");
    }

    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushTokenString;
  } else {
    throw new Error("Must use physical device for push notifications");
  }
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? null))
      .catch((error) =>
        console.error("Failed to register for notifications:", error)
      );

    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     setNotification(notification);
    //   });

    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     const farmId = response.notification.request.content.data.farmId;
    //     const farmName = response.notification.request.content.data.farmName;

    //     // const deepLink = Linking.createURL(
    //     //   `/(tabs)/myfarms/${farmId}/farmdetail?farmName=${encodeURIComponent(
    //     //     farmName
    //     //   )}`
    //     // );
    //     // Linking.openURL(deepLink);

    //     // router.push({
    //     //   pathname: "fololimo://modals",
    //     //   params: { id: farmId, farmName: "farm" },
    //     // });

    //     // Navigate to the modals page with the farm ID
    //     // router.push({ pathname: "/(modals)", params: { farmId } });
    //     router.push({
    //       pathname: `/(tabs)/myfarms/[farmdet]/farmdetail`,
    //       params: { farmdet: farmId, farmName: farmName },
    //     });
    //     // }
    //   });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken, notification };
}
