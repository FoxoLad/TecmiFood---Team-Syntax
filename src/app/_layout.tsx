import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

export default function RootLayout() {
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
