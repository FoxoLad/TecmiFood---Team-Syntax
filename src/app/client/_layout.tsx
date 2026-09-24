/** Stack del cliente. Las pestañas y las pantallas internas comparten el fondo de la app. */
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useColors } from "../../stores/useTheme";

export default function ClientLayout() {
  const colors = useColors();

  return (
    <Stack
      screenOptions={{
        animation: Platform.OS === "ios" ? "slide_from_right" : "fade_from_bottom",
        contentStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      <Stack.Screen name="(client-tabs)" />
      <Stack.Screen name="products" />
      <Stack.Screen
        name="cafeterias/bustershome"
        options={{ title: "Cafetería" }}
      />
    </Stack>
  );
}