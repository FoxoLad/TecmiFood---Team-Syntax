import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii } from "../../../constants/theme";
import { useOrders } from "../../../stores/useOrders";
import {
    ORDER_STATUS_LABELS,
    type Order,
    type OrderStatus,
} from "../../../types/order";

type OrderFilter = "pending" | "preparing" | "ready" | "delivered" | "all";

const FILTERS: { key: OrderFilter; label: string }[] = [
  { key: "pending", label: "Nuevos" },
  { key: "preparing", label: "Preparando" },
  { key: "ready", label: "Listos" },
  { key: "delivered", label: "Entregados" },
  { key: "all", label: "Todos" },
];

const statusColor: Record<OrderStatus, string> = {
  pending: "#f27600",
  preparing: "#0A5FCC",
  ready: "#15803d",
  delivered: colors.textSecondary,
};

function matchesFilter(order: Order, filter: OrderFilter) {
  if (filter === "all") {
    return true;
  }

  return order.status === filter;
}

export default function EmployeeOrdersScreen() {
  const orders = useOrders((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("pending");
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);

  const filterCounts = useMemo(() => {
    const counts: Record<OrderFilter, number> = {
      pending: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      all: orders.length,
    };

    for (const order of orders) {
      counts[order.status] += 1;
    }

    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return orders.filter((order) => {
      if (!matchesFilter(order, selectedFilter)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const inNumber = String(order.orderNumber).padStart(3, "0").includes(query);
      const inCustomer = order.customerName.toLowerCase().includes(query);
      const inProducts = order.items.some((item) =>
        item.product.name.toLowerCase().includes(query),
      );

      return inNumber || inCustomer || inProducts;
    });
  }, [orders, searchQuery, selectedFilter]);

  const returnToClient = () => {
    setShowReturnConfirmation(false);
    router.replace("/client/(client-tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver al menú del cliente"
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => setShowReturnConfirmation(true)}
          style={styles.backButton}
        >
          <Ionicons color={colors.text} name="chevron-back" size={28} />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.eyebrow}>COCINA</Text>
          <Text style={styles.screenTitle}>Pedidos</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.helperText}>
        Aquí llegan los pedidos de los clientes. Ábrelo, prepáralo y márcalo como listo para recoger.
      </Text>

      <View style={styles.filters}>
        {FILTERS.map((filter) => {
          const selected = selectedFilter === filter.key;
          const count = filterCounts[filter.key];

          return (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              style={[styles.filterButton, selected && styles.filterButtonActive]}
            >
              <Text style={[styles.filterText, selected && styles.activeFilterText]}>
                {filter.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons color={colors.textSecondary} name="search-outline" size={22} />
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearchQuery}
          placeholder="Buscar por número, cliente o producto"
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={searchQuery}
        />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredOrders}
        keyExtractor={(order) => order.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons color={colors.accent} name="receipt-outline" size={42} />
            <Text style={styles.emptyTitle}>No hay pedidos en esta lista</Text>
            <Text style={styles.emptyMessage}>
              Cuando un cliente pulse “Enviar pedido a cocina”, aparecerá aquí para que puedas aceptarlo.
            </Text>
          </View>
        }
        renderItem={({ item: order }) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <Pressable
              accessibilityLabel={`Ver pedido ${order.orderNumber}`}
              accessibilityRole="button"
              onPress={() => router.push(`/employee/orders/${order.id}`)}
              style={styles.orderCard}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>
                  Pedido #{String(order.orderNumber).padStart(3, "0")}
                </Text>
                <Text style={[styles.statusValue, { color: statusColor[order.status] }]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Text>
              </View>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <Text style={styles.itemPreview} numberOfLines={2}>
                {order.items
                  .map((item) => `${item.quantity}× ${item.product.name}`)
                  .join(" · ")}
              </Text>
              <View style={styles.orderFooter}>
                <Text style={styles.itemCount}>
                  {itemCount} {itemCount === 1 ? "producto" : "productos"}
                </Text>
                <Text style={styles.totalText}>Total ${order.total.toFixed(2)}</Text>
              </View>
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setShowReturnConfirmation(false)}
        transparent
        visible={showReturnConfirmation}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>Salir de cocina</Text>
            <Text style={styles.modalMessage}>
              Vas a volver al menú del cliente. Los pedidos seguirán guardados.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowReturnConfirmation(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={returnToClient} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Volver</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  backButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  headerTitles: {
    flex: 1,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  headerSpacer: {
    width: 42,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  filterButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  activeFilterText: {
    color: colors.text,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    height: 46,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    height: "100%",
    marginLeft: 8,
  },
  listContent: {
    gap: 12,
    padding: 16,
    paddingBottom: 28,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.medium,
    borderWidth: 1,
    padding: 14,
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
  statusValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  customerName: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  itemPreview: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  orderFooter: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
  },
  itemCount: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  totalText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
    textAlign: "center",
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  confirmationModal: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    maxWidth: 360,
    padding: 22,
    width: "100%",
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalMessage: {
    color: "#333333",
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  cancelButton: {
    borderColor: "#777777",
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  cancelButtonText: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#000000",
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
