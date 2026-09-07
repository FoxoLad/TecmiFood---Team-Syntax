import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e5e5",
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio", tabBarIcon: ({ color }) => <Ionicons color={color} name="home" size={28} /> }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ title: "Carrito", tabBarIcon: ({ color }) => <Ionicons color={color} name="cart-outline" size={29} /> }} />
      <Tabs.Screen name="notifications" options={{ title: "Notificaciones", tabBarIcon: ({ color }) => <Ionicons color={color} name="notifications-outline" size={28} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color }) => <Ionicons color={color} name="person-outline" size={28} /> }} />
    </Tabs>
  );
}