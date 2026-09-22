import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii } from "../../../constants/theme";
import { useOrders } from "../../../stores/useOrders";

export default function EmployeeOrdersScreen() {
  const { orders, isLoading, fetchOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState("Pendientes");
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
    //Auto-refresh cada 10 segundos
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesName = order.customerName.toLowerCase().includes(query);
    const matchesOrder = String(order.orderNumber).includes(query);
    const isDelivered = order.status === "Entregado";
    const matchesStatus =
      selectedFilter === "Todos" ||
      (selectedFilter === "Entregados" ? isDelivered : !isDelivered);
    return (matchesName || matchesOrder) && matchesStatus;
  });

  const confirmReturnToClient = () => {
    setShowReturnConfirmation(true);
  };

  const returnToClient = () => {
    setShowReturnConfirmation(false);
    router.replace("/client/(client-tabs)/home");
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        contentContainerStyle={style.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={style.header}>
          <Pressable
            accessibilityLabel="Volver al menú del cliente"
            accessibilityRole="button"
            hitSlop={12}
            onPress={confirmReturnToClient}
            style={style.backButton}
          >
            <Ionicons color="#111110" name="chevron-back" size={34} />
          </Pressable>
          <Text style={style.screenTitle}>ORDENES</Text>
          <Pressable
            style={style.historyButton}
            onPress={() => router.push("/employee/history" as any)}
          >
            <Ionicons name="bar-chart-outline" size={24} color={colors.text} />
          </Pressable>
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

        {isLoading && orders.length === 0 ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Cargando órdenes...
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const orderNumber = order.orderNumber;
            const total = order.totalAmount;
            const isDeliveredView = selectedFilter === "Entregados";
            const displayStatus = order.status;

            return (
              <View
                key={order._id || orderNumber}
                style={[
                  style.orderCard,
                  isDeliveredView && style.deliveredOrderCard,
                ]}
              >
                <View
                  style={[
                    style.orderHeader,
                    isDeliveredView && style.deliveredOrderHeader,
                  ]}
                >
                  <Text
                    style={[
                      style.orderNumber,
                      isDeliveredView && style.deliveredOrderNumber,
                    ]}
                  >
                    #{String(orderNumber).padStart(3, "0")} -{" "}
                    {order.customerName}
                  </Text>
                  <Text
                    style={[
                      style.status,
                      isDeliveredView && style.deliveredStatusText,
                    ]}
                  >
                    Estado:{" "}
                    <Text
                      style={[
                        style.statusValue,
                        isDeliveredView && style.deliveredStatus,
                      ]}
                    >
                      {displayStatus}
                    </Text>
                  </Text>
                </View>

                {order.items.map((product, idx) => (
                  <Pressable
                    accessibilityLabel={`Ver detalles de la orden ${orderNumber}`}
                    accessibilityRole="button"
                    key={`${product.productId}-${idx}`}
                    onPress={() =>
                      router.push(`/employee/orders/${orderNumber}`)
                    }
                    style={[
                      style.productRow,
                      isDeliveredView && style.deliveredProductRow,
                    ]}
                  >
                    <View
                      style={[
                        style.productActions,
                        isDeliveredView && style.deliveredProductActions,
                      ]}
                    >
                      {product.image?.startsWith("http") ? (
                        <Image
                          source={{ uri: product.image }}
                          style={[
                            style.productImage,
                            isDeliveredView && style.deliveredProductImage,
                          ]}
                        />
                      ) : product.image &&
                        productsImages[
                          product.image as keyof typeof productsImages
                        ] ? (
                        <Image
                          source={
                            productsImages[
                              product.image as keyof typeof productsImages
                            ]
                          }
                          style={[
                            style.productImage,
                            isDeliveredView && style.deliveredProductImage,
                          ]}
                        />
                      ) : (
                        <View
                          style={[
                            style.productImage,
                            isDeliveredView && style.deliveredProductImage,
                            { backgroundColor: "#f0f0f0", borderRadius: 8 },
                          ]}
                        />
                      )}
                    </View>
                    <View style={style.productDetails}>
                      <Text
                        style={[
                          style.productName,
                          isDeliveredView && style.deliveredProductName,
                        ]}
                      >
                        {product.quantity}x {product.name}
                      </Text>
                      {product.modifications &&
                        product.modifications.length > 0 && (
                          <Text style={style.productName} numberOfLines={1}>
                            Mods: {product.modifications.join(", ")}
                          </Text>
                        )}
                    </View>
                  </Pressable>
                ))}

                <View
                  style={[
                    style.totalContainer,
                    isDeliveredView && style.deliveredTotalContainer,
                  ]}
                >
                  <Text
                    style={[
                      style.totalText,
                      isDeliveredView && style.deliveredTotalText,
                    ]}
                  >
                    Total:
                  </Text>
                  <Text
                    style={[
                      style.totalAmount,
                      isDeliveredView && style.deliveredTotalAmount,
                    ]}
                  >
                    ${total.toFixed(2)}
                  </Text>
                </View>
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
  historyButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
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
    fontSize: 22,
    fontWeight: "800",
  },
  deliveredOrderNumber: {
    fontSize: 18,
  },
  status: {
    fontSize: 18,
    fontWeight: "800",
  },
  statusValue: {
    color: "#f27600",
    fontWeight: "400",
  },
  deliveredStatus: {
    color: "#15803d",
  },
  productRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
  },
  deliveredProductRow: {
    paddingVertical: 5,
  },
  productActions: {
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveredProductActions: {
    width: 40,
    height: 40,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  deliveredProductImage: {
    opacity: 0.8,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  deliveredProductName: {
    fontSize: 15,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMuted,
  },
  deliveredTotalContainer: {
    paddingVertical: 6,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  deliveredTotalText: {
    fontSize: 15,
  },
  deliveredTotalAmount: {
    fontSize: 15,
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
