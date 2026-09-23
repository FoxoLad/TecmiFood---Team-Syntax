/** Stack del cliente. Las pestañas y las pantallas internas comparten el fondo de la app. */
import { Stack } from "expo-router";
import { colors } from "../../constants/theme";

export default function ClientLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        animationDuration: 250,
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