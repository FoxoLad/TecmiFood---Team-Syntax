import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../constants/theme";
import { useCartStore } from "../../../stores/useCart";

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets();
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const cartBadge = cartItemCount > 99 ? "99+" : String(cartItemCount);

  const renderCartIcon = ({ color }: { color: ColorValue }) => (
    <View style={styles.cartIconWrapper}>
      <Ionicons color={color} name="cart-outline" size={29} />
      {cartItemCount > 0 ? (
        <View style={[styles.cartBadge, cartBadge.length > 2 && styles.cartBadgeWide]}>
          <Text style={styles.cartBadgeText}>{cartBadge}</Text>
        </View>
      ) : null}
    </View>
  );

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
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ title: "Carrito", tabBarIcon: renderCartIcon }} />
      <Tabs.Screen name="notifications" options={{ title: "Notificaciones", tabBarIcon: ({ color }) => <Ionicons color={color} name="notifications-outline" size={28} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color }) => <Ionicons color={color} name="person-outline" size={28} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cartIconWrapper: {
    height: 34,
    position: "relative",
    width: 34,
  },
  cartBadge: {
    alignItems: "center",
    backgroundColor: colors.danger,
    borderColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: 2,
    position: "absolute",
    right: -7,
    top: -6,
  },
  cartBadgeWide: {
    minWidth: 30,
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 13,
  },
});