import { AuthProvider } from "@/contexts/AuthContext";
import { ImageProvider } from "@/contexts/ImageContext";
import { Stack } from "expo-router/stack";
import { OnboardingProvider } from "@/contexts/OnBoardingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
export default function Layout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <ImageProvider>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(modals)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </ImageProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
