import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import SafeView from "../../components/SafeView";
import { colors, radii, spacing } from "../../constants/theme";
import { useOrders } from "../../stores/useOrders";
import type { Order, OrderStatus } from "../../types/order";

type OrdersView = "active" | "history";

const statusStyles: Record<
  OrderStatus,
  { backgroundColor: string; color: string; label: string }
> = {
  pending: { backgroundColor: colors.accentSoft, color: colors.accent, label: "Recibido" },
  preparing: { backgroundColor: "#E5F1FF", color: "#0A5FCC", label: "En preparación" },
  ready: { backgroundColor: "#E3F6E8", color: "#15803d", label: "Listo para recoger" },
  delivered: { backgroundColor: colors.surfaceMuted, color: colors.textSecondary, label: "Entregado" },
};

const emptyStates: Record<OrdersView, { title: string; message: string; icon: "cart-outline" | "time-outline" }> = {
  active: {
    title: "No tienes pedidos activos",
    message: "Cuando realices un pedido podrás seguirlo aquí.",
    icon: "cart-outline",
  },
  history: {
    title: "Aún no tienes historial",
    message: "Tus pedidos entregados aparecerán aquí.",
    icon: "time-outline",
  },
};

type NumberedOrder = { number: number; order: Order };

export default function ClientOrdersScreen() {
  const { view: viewParam } = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<OrdersView>(viewParam === "history" ? "history" : "active");
  const orders = useOrders((state) => state.orders);

  // Same numbering scheme as the notifications screen: newest order has the highest number.
  const { active, history } = useMemo(() => {
    const numbered: NumberedOrder[] = orders.map((order, index) => ({
      number: orders.length - index,
      order,
    }));

    return {
      active: numbered.filter(({ order }) => order.status !== "delivered"),
      history: numbered.filter(({ order }) => order.status === "delivered"),
    };
  }, [orders]);

  const visibleOrders = view === "active" ? active : history;
  const emptyState = emptyStates[view];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/client/profile");
    }
  };

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver al perfil"
          accessibilityRole="button"
          hitSlop={8}
          onPress={goBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons color={colors.text} name="chevron-back" size={24} />
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>TUS PEDIDOS</Text>
          <Text style={styles.title}>{view === "active" ? "Pedidos activos" : "Historial"}</Text>
        </View>
      </View>

      <View style={styles.segmentedControl}>
        {(
          [
            { key: "active", label: "Activos", count: active.length },
            { key: "history", label: "Historial", count: history.length },
          ] as const
        ).map((option) => {
          const selected = view === option.key;

          return (
            <Pressable
              accessibilityLabel={`${option.label}, ${option.count} pedidos`}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              key={option.key}
              onPress={() => setView(option.key)}
              style={[styles.segment, selected && styles.segmentSelected]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                {option.label} ({option.count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      {visibleOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons color={colors.accent} name={emptyState.icon} size={42} />
          </View>
          <Text style={styles.emptyTitle}>{emptyState.title}</Text>
          <Text style={styles.emptyMessage}>{emptyState.message}</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={visibleOrders}
          keyExtractor={({ order }) => order.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: { number, order } }) => {
            const status = statusStyles[order.status];

            return (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Orden #{String(number).padStart(3, "0")}</Text>
                  <View style={[styles.statusPill, { backgroundColor: status.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleString("es-MX")}
                </Text>

                <View style={styles.itemsList}>
                  {order.items.map((item, index) => (
                    <View key={`${item.product.id}-${index}`} style={styles.itemRow}>
                      <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                      <Text numberOfLines={2} style={styles.itemName}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: spacing.screen,
    paddingTop: 10,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  pressed: {
    opacity: 0.72,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 2,
  },
  segmentedControl: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.small,
    flexDirection: "row",
    marginHorizontal: spacing.screen,
    marginTop: 16,
    padding: 3,
  },
  segment: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    paddingVertical: 9,
  },
  segmentSelected: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  segmentTextSelected: {
    color: colors.text,
  },
  listContent: {
    gap: 12,
    padding: spacing.screen,
    paddingBottom: 28,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.medium,
    borderWidth: 1,
    padding: 16,
  },
  orderHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statusPill: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  orderDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  itemsList: {
    borderColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
  },
  itemRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  itemQuantity: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "800",
    minWidth: 26,
  },
  itemName: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  itemPrice: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  totalRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  totalValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "900",
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 36,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 86,
    justifyContent: "center",
    width: 86,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 18,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 280,
    textAlign: "center",
  },
});
