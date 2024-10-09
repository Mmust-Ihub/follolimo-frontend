import { AuthProvider } from "@/contexts/AuthContext";
import { ImageProvider } from "@/contexts/ImageContext";
import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <AuthProvider>
      <ImageProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{headerShown: false}} />
        </Stack>
      </ImageProvider>
    </AuthProvider>
  );
}
