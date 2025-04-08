import { AuthProvider } from "@/contexts/AuthContext";
import { ImageProvider } from "@/contexts/ImageContext";

import { useRouter, Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { OnboardingProvider } from "@/contexts/OnBoardingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FetchProvider } from "@/contexts/usefetchData";
import "../global.css";
import { useEffect } from "react";

export default function Layout() {
  const router = useRouter();

  const navigateToFarm = (data: any) => {
    const { screen, farmId, farmName } = data;
    if (screen === "Notifications" && farmId && farmName) {
      // omit the (tabs) group here
      router.push({
        pathname: "/myfarms/[farmdet]/farmdetail",
        params: { farmdet: farmId, farmName },
      });
    }
  };

  useEffect(() => {
    // 1) Handle cold‑start
    Notifications.getLastNotificationResponseAsync().then((resp) => {
      if (resp) navigateToFarm(resp.notification.request.content.data);
    });

    // 2) Handle taps when app is foreground/background
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => navigateToFarm(response.notification.request.content.data)
    );

    return () => sub.remove();
  }, []);

  return (
    <AuthProvider>
      <OnboardingProvider>
        <ImageProvider>
          <ThemeProvider>
            <FetchProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(modals)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </FetchProvider>
          </ThemeProvider>
        </ImageProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
