import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import { useUserStore } from "../stores/useUserStore";

export default function RootLayout() {
  const initializeUser = useUserStore((state) => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          animation: "fade",
          animationDuration: 250,
          contentStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
          headerShown: false,
        }}
      >
        <Stack.Screen name="client" />
        <Stack.Screen name="employee" />
      </Stack>
    </SafeAreaProvider>
  );
}
