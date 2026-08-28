import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="products/index" />
    <Stack.Screen name="products/[id]" />
  </Stack>
}
