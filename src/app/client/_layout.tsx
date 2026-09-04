import { Stack } from "expo-router";

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(client-tabs)" />
      <Stack.Screen name="products" />
    </Stack>
  );
}