import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function ClientTabsLayout() {
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
          height: 74,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio", tabBarIcon: ({ color, focused }) => <Ionicons color={color} name={focused ? "home" : "home-outline"} size={29} /> }} />
      <Tabs.Screen name="explore" options={{ title: "Explorar", tabBarIcon: ({ color, focused }) => <Ionicons color={color} name={focused ? "compass" : "compass-outline"} size={29} /> }} />
      <Tabs.Screen name="cart" options={{ title: "Carrito", tabBarIcon: ({ color, focused }) => <Ionicons color={color} name={focused ? "cart" : "cart-outline"} size={29} /> }} />
      <Tabs.Screen name="notifications" options={{ title: "Notificaciones", tabBarIcon: ({ color, focused }) => <Ionicons color={color} name={focused ? "notifications" : "notifications-outline"} size={29} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color, focused }) => <Ionicons color={color} name={focused ? "person" : "person-outline"} size={29} /> }} />
    </Tabs>
  );
}