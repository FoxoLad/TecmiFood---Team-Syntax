import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../constants/theme";

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
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