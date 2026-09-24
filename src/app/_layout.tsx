/** Layout raíz. Inicializa al cliente, muestra la entrada del grano de café y aplica la transición entre pantallas. */
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CoffeeSplash } from "../components/CoffeeSplash";
import { ThemeReveal } from "../components/ThemeReveal";
import { useColors, useThemeStore } from "../stores/useTheme";
import { useUserStore } from "../stores/useUserStore";

SplashScreen.setOptions({
  duration: 350,
  fade: true,
});
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const initializeUser = useUserStore((state) => state.initializeUser);
  const colors = useColors();
  const phase = useThemeStore((state) => state.phase);
  const target = useThemeStore((state) => state.target);
  const statusBar =
    phase === "expanding" && target
      ? target === "dark"
        ? "light"
        : "dark"
      : colors.statusBar === "light-content"
        ? "light"
        : "dark";

  useEffect(() => {
    initializeUser();
    SplashScreen.hideAsync().catch(() => {});
  }, [initializeUser]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  return (
    <SafeAreaProvider>
      <StatusBar animated style={statusBar} />
      <Stack
        screenOptions={{
          animation: Platform.OS === "ios" ? "slide_from_right" : "fade_from_bottom",
          contentStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
          headerShown: false,
        }}
      >
        <Stack.Screen name="client" />
        <Stack.Screen name="employee" />
      </Stack>
      <ThemeReveal />
      <CoffeeSplash />
    </SafeAreaProvider>
  );
}
