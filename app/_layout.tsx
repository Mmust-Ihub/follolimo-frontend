import { AuthProvider } from "@/contexts/AuthContext";
import { ImageProvider } from "@/contexts/ImageContext";
import { Stack } from "expo-router/stack";
import { OnboardingProvider } from "@/contexts/OnBoardingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FetchProvider } from "@/contexts/usefetchData";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import "../global.css";

export default function Layout() {
  const router = useRouter();
  useEffect(() => {
    const deepLinkHandler = (event: { url: string }) => {
      const { url } = event;
      if (url) {
        const parsed = Linking.parse(url);
        if (parsed.path) {
          router.push({ pathname: parsed.path as any });
        }
      }
    };

    const subscription = Linking.addEventListener("url", deepLinkHandler);
    return () => {
      subscription.remove();
    };
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
