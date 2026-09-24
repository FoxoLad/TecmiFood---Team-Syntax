/** Barra inferior del cliente. Muestra cuántos productos hay en el carrito y cuántos avisos hay sin leer. */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type Palette } from "../../../constants/theme";
import { useColors } from "../../../stores/useTheme";
import { useCartStore } from "../../../stores/useCartStore";
import { useOrders } from "../../../stores/useOrders";
import { useUserStore } from "../../../stores/useUserStore";
import { isAlertVisible, isClientOrder } from "../../../utils/client";

export default function ClientTabsLayout() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const cartBadge = cartItemCount > 99 ? "99+" : String(cartItemCount);
  const clientId = useUserStore((state) => state.clientId);
  const notificationsClearedAt = useUserStore((state) => state.notificationsClearedAt);
  const alertCount = useOrders((state) =>
    state.orders.filter(
      (order) =>
        isClientOrder(order.customerName, clientId) &&
        isAlertVisible(order.updatedAt, notificationsClearedAt),
    ).length,
  );
  const alertBadge = alertCount > 99 ? "99+" : String(alertCount);

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
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 68 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
        },
        freezeOnBlur: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio", tabBarIcon: ({ color }) => <Ionicons color={color} name="home" size={28} /> }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ title: "Carrito", tabBarIcon: renderCartIcon }} />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color }) => (
            <View style={styles.cartIconWrapper}>
              <Ionicons color={color} name="notifications-outline" size={28} />
              {alertCount > 0 ? (
                <View style={[styles.cartBadge, alertBadge.length > 2 && styles.cartBadgeWide]}>
                  <Text style={styles.cartBadgeText}>{alertBadge}</Text>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color }) => <Ionicons color={color} name="person-outline" size={28} /> }} />
    </Tabs>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
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
}