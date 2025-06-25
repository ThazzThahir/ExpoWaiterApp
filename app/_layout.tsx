import { Slot, useSegments, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppThemeProvider } from "../components/common/AppThemeProvider";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/(tabs)");
    }
  }, [isNavigationReady, isAuthenticated, segments]);

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <StatusBar style="auto" />
        <Slot />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}