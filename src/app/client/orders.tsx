import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import SafeView from "../../components/SafeView";
import { ProductImage } from "../../components/ProductImage";
import { colors, radii, spacing } from "../../constants/theme";
import { useOrders } from "../../stores/useOrders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "../../types/order";

type OrdersView = "active" | "history";

const statusStyles: Record<
  OrderStatus,
  { backgroundColor: string; color: string; label: string }
> = {
  pending: { backgroundColor: colors.accentSoft, color: colors.accent, label: ORDER_STATUS_LABELS.pending },
  preparing: { backgroundColor: "#E5F1FF", color: "#0A5FCC", label: ORDER_STATUS_LABELS.preparing },
  ready: { backgroundColor: "#E3F6E8", color: "#15803d", label: ORDER_STATUS_LABELS.ready },
  delivered: { backgroundColor: colors.surfaceMuted, color: colors.textSecondary, label: ORDER_STATUS_LABELS.delivered },
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

export default function ClientOrdersScreen() {
  const { view: viewParam } = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<OrdersView>(viewParam === "history" ? "history" : "active");
  const orders = useOrders((state) => state.orders);

  const { active, history } = useMemo(() => {
    return {
      active: orders.filter((order) => order.status !== "Entregado"),
      history: orders.filter((order) => order.status === "Entregado"),
    };
  }, [orders]);

  const visibleOrders = view === "active" ? active : history;
  const emptyState = emptyStates[view];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/client/(client-tabs)/profile");
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
          keyExtractor={(order) => order._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: order }) => {
            const status = (statusStyles as any)[order.status] || { backgroundColor: "#ccc", color: "#000", label: order.status };

            return (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>
                    Pedido #{String(order.orderNumber).padStart(3, "0")}
                  </Text>
                  <View style={[styles.statusPill, { backgroundColor: status.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleString("es-MX")}
                </Text>

                <View style={styles.itemsList}>
                  {order.items.map((item, index) => (
                    <View key={`${item.productId}-${index}`} style={styles.itemRow}>
                      <ProductImage
                        contentFit="cover"
                        image={item.image}
                        name={item.name}
                        style={styles.itemImage}
                      />
                      <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                      <Text numberOfLines={2} style={styles.itemName}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${order.totalAmount.toFixed(2)}</Text>
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
    borderColor: "#E7E2D8",
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    padding: 16,
    shadowColor: "#302512",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
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
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  itemImage: {
    borderRadius: 10,
    height: 40,
    width: 40,
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
