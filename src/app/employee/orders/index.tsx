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
import { productsImages } from "../../../constants/images";
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
    router.replace("/client/home");
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

        <View style={style.filters}>
          {["Pendientes", "Entregados", "Todos"].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={style.filterButton}
            >
              <Text
                style={[
                  style.filterText,
                  selectedFilter === filter && style.activeFilterText,
                ]}
              >
                {filter}
              </Text>
              <View
                style={[
                  style.filterLine,
                  selectedFilter === filter && style.activeFilterLine,
                ]}
              />
            </Pressable>
          ))}
        </View>

        <View style={style.searchContainer}>
          <Ionicons color="#333333" name="search-outline" size={27} />
          <TextInput
            autoCapitalize="none"
            onChangeText={setSearchQuery}
            placeholder="Buscar"
            placeholderTextColor="#333333"
            style={style.searchInput}
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
            const isDeliveredView = order.status === "Entregado";
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
                    numberOfLines={1}
                    ellipsizeMode="tail"
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
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text
                          style={[
                            style.productName,
                            isDeliveredView && style.deliveredProductName,
                            { flex: 1 }
                          ]}
                        >
                          {product.quantity}x {product.name}
                        </Text>
                        <Text style={[style.productName, isDeliveredView && style.deliveredProductName, { fontWeight: "bold" }]}>
                          ${(product.price * product.quantity).toFixed(2)}
                        </Text>
                      </View>
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
            );
          })
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowReturnConfirmation(false)}
        transparent
        visible={showReturnConfirmation}
      >
        <View style={style.modalBackdrop}>
          <View style={style.confirmationModal}>
            <Text style={style.modalTitle}>Volver al menú del cliente</Text>
            <Text style={style.modalMessage}>
              ¿Quieres salir del listado de pedidos?
            </Text>
            <View style={style.modalActions}>
              <Pressable
                onPress={() => setShowReturnConfirmation(false)}
                style={style.cancelButton}
              >
                <Text style={style.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={returnToClient} style={style.confirmButton}>
                <Text style={style.confirmButtonText}>Volver</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 6,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
  },
  historyButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
  },
  screenTitle: {
    fontSize: 38,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 34,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterButton: {
    alignItems: "center",
    paddingHorizontal: 7,
  },
  filterText: {
    fontSize: 23,
    fontWeight: "700",
  },
  activeFilterText: {
    color: "#111110",
  },
  filterLine: {
    backgroundColor: "transparent",
    height: 2,
    marginTop: 5,
    width: "100%",
  },
  activeFilterLine: {
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    color: "#111110",
    flex: 1,
    fontSize: 18,
    height: "100%",
    marginLeft: 10,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.large,
    borderWidth: 1.5,
    marginBottom: 7,
    overflow: "hidden",
  },
  deliveredOrderCard: {
    borderRadius: 16,
    marginBottom: 5,
  },
  orderHeader: {
    alignItems: "center",
    borderBottomColor: "#111110",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingVertical: 8,
    gap: 8,
  },
  deliveredOrderHeader: {
    paddingVertical: 2,
  },
  orderNumber: {
    fontSize: 18, // slightly smaller to ensure fit
    fontWeight: "800",
    flex: 1, // take available space
  },
  deliveredOrderNumber: {
    fontSize: 18,
  },
  status: {
    fontSize: 18,
    fontWeight: "700",
  },
  deliveredStatusText: {
    fontSize: 14,
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
    padding: 22,
    width: "100%",
    maxWidth: 360,
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
  oldSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE6CE",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: "#111110",
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 8,
  },
});
