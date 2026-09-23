/** Layout raíz. Inicializa al cliente, muestra la entrada del grano de café y aplica la transición entre pantallas. */
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CoffeeSplash } from "../components/CoffeeSplash";
import { colors } from "../constants/theme";
import { useUserStore } from "../stores/useUserStore";

SplashScreen.setOptions({
  duration: 350,
  fade: true,
});
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const initializeUser = useUserStore((state) => state.initializeUser);

  useEffect(() => {
    initializeUser();
    SplashScreen.hideAsync().catch(() => {});
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
      <CoffeeSplash />
    </SafeAreaProvider>
  );
}
