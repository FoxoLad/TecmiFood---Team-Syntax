/** Lista de órdenes para el empleado, con búsqueda, filtros y actualización automática. */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmployeeHeader } from "../../../components/EmployeeHeader";
import { ProductImage } from "../../../components/ProductImage";
import { colors, employee, radii, shadows } from "../../../constants/theme";
import {
  isValidTime,
  maskTime,
  useCafeteriaStatus,
} from "../../../stores/useCafeteriaStatus";
import { useOrders } from "../../../stores/useOrders";
import { formatOrderNumber, ORDER_STATUS_LABELS } from "../../../types/order";

const statusStyles: Record<string, { backgroundColor: string; color: string; label: string }> = {
  "Pendiente": { backgroundColor: colors.accentSoft, color: colors.accent, label: ORDER_STATUS_LABELS["Pendiente"] },
  "En preparación": { backgroundColor: "#E5F1FF", color: "#0A5FCC", label: ORDER_STATUS_LABELS["En preparación"] },
  "Terminado": { backgroundColor: "#E3F6E8", color: "#15803d", label: ORDER_STATUS_LABELS["Terminado"] },
  "Entregado": { backgroundColor: colors.surfaceMuted, color: colors.textSecondary, label: ORDER_STATUS_LABELS["Entregado"] },
  "Cancelado": { backgroundColor: "#FFE5E5", color: "#CC0A0A", label: ORDER_STATUS_LABELS["Cancelado"] },
};

export default function EmployeeOrdersScreen() {
  const { orders, isLoading, fetchOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState("Pendientes");
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isOpen = useCafeteriaStatus((state) => state.isOpen);
  const opensAt = useCafeteriaStatus((state) => state.opensAt);
  const closesAt = useCafeteriaStatus((state) => state.closesAt);
  const setOpen = useCafeteriaStatus((state) => state.setOpen);
  const setHours = useCafeteriaStatus((state) => state.setHours);
  const fetchStatus = useCafeteriaStatus((state) => state.fetchStatus);
  const [hourDraft, setHourDraft] = useState({
    opensAt,
    closesAt,
    sourceOpen: opensAt,
    sourceClose: closesAt,
  });
  if (hourDraft.sourceOpen !== opensAt || hourDraft.sourceClose !== closesAt) {
    setHourDraft({
      opensAt,
      closesAt,
      sourceOpen: opensAt,
      sourceClose: closesAt,
    });
  }

  const saveHours = () => {
    if (isValidTime(hourDraft.opensAt) && isValidTime(hourDraft.closesAt)) {
      setHours(hourDraft.opensAt, hourDraft.closesAt);
      return;
    }
    setHourDraft({
      opensAt,
      closesAt,
      sourceOpen: opensAt,
      sourceClose: closesAt,
    });
  };

  useEffect(() => {
    fetchOrders();
    fetchStatus();
    //Auto-refresh cada 10 segundos
    const interval = setInterval(() => {
      fetchOrders();
      fetchStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchStatus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesName = order.customerName.toLowerCase().includes(query);
    const matchesOrder = String(order.orderNumber).includes(query);
    const matchesProduct = order.items.some(item => 
      item.name.toLowerCase().includes(query)
    );
    const isDelivered = order.status === "Entregado";
    const isClosed = isDelivered || order.status === "Cancelado";
    const matchesStatus =
      selectedFilter === "Todos" ||
      (selectedFilter === "Entregados" ? isDelivered : !isClosed);
    return (matchesName || matchesOrder || matchesProduct) && matchesStatus;
  });

  const confirmReturnToClient = () => {
    setShowReturnConfirmation(true);
  };

  const returnToClient = () => {
    setShowReturnConfirmation(false);
    router.replace("/client/home");
  };

  return (
    <View style={style.shell}>
      <SafeAreaView edges={["top"]} style={style.shellTop}>
        <EmployeeHeader
          backLabel="Cliente"
          onBack={confirmReturnToClient}
          right={
            <Pressable
              accessibilityLabel="Ver ventas"
              accessibilityRole="button"
              onPress={() => router.push("/employee/history")}
              style={style.historyButton}
            >
              <Ionicons color={employee.accent} name="bar-chart-outline" size={24} />
            </Pressable>
          }
          title="Órdenes"
        />
      </SafeAreaView>
      <SafeAreaView edges={["bottom"]} style={style.sheet}>
      <ScrollView
        contentContainerStyle={style.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={style.statusCard}>
          <View style={style.statusTop}>
            <View
              accessibilityLabel={isOpen ? "Cafetería abierta" : "Cafetería cerrada"}
              style={[style.statusHalo, isOpen ? style.statusHaloOpen : style.statusHaloClosed]}
            >
              <View style={[style.statusCore, isOpen ? style.statusCoreOpen : style.statusCoreClosed]} />
            </View>
            <View style={style.statusCopy}>
              <Text style={style.statusTitle}>{isOpen ? "Abierta" : "Cerrada"}</Text>
              <Text style={style.statusHint}>
                {isOpen ? "Lista para recibir pedidos." : "No está recibiendo pedidos."}
              </Text>
            </View>
            <Switch
              accessibilityLabel={isOpen ? "Cerrar cafetería" : "Abrir cafetería"}
              accessibilityRole="switch"
              ios_backgroundColor="#E7D5D3"
              onValueChange={setOpen}
              thumbColor={isOpen ? colors.success : colors.danger}
              trackColor={{ false: "#F3D6D4", true: "#D7F3E1" }}
              value={isOpen}
            />
          </View>
          <Text style={style.hoursLabel}>Horario</Text>
          <View style={style.hoursRow}>
            <TextInput
              accessibilityLabel="Hora de apertura"
              keyboardType="number-pad"
              maxLength={5}
              onBlur={saveHours}
              onChangeText={(value) =>
                setHourDraft((current) => ({ ...current, opensAt: maskTime(value) }))
              }
              placeholder="08:00"
              placeholderTextColor={colors.textSecondary}
              selectTextOnFocus
              style={[
                style.hourInput,
                hourDraft.opensAt.length === 5 && !isValidTime(hourDraft.opensAt) && style.hourInputInvalid,
              ]}
              value={hourDraft.opensAt}
            />
            <Text style={style.hoursSeparator}>a</Text>
            <TextInput
              accessibilityLabel="Hora de cierre"
              keyboardType="number-pad"
              maxLength={5}
              onBlur={saveHours}
              onChangeText={(value) =>
                setHourDraft((current) => ({ ...current, closesAt: maskTime(value) }))
              }
              placeholder="17:00"
              placeholderTextColor={colors.textSecondary}
              selectTextOnFocus
              style={[
                style.hourInput,
                hourDraft.closesAt.length === 5 && !isValidTime(hourDraft.closesAt) && style.hourInputInvalid,
              ]}
              value={hourDraft.closesAt}
            />
          </View>
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
          <View style={style.emptyState}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={style.emptyMessage}>Cargando órdenes...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={style.emptyState}>
            <Ionicons color={colors.accent} name="receipt-outline" size={42} />
            <Text style={style.emptyTitle}>No hay órdenes</Text>
            <Text style={style.emptyMessage}>
              {searchQuery.trim()
                ? "Prueba con otro nombre, número o producto."
                : "Cuando llegue un pedido nuevo, aparecerá aquí."}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const status = statusStyles[order.status] || { backgroundColor: "#ccc", color: "#000", label: order.status };

            return (
              <Pressable
                key={order._id || order.orderNumber}
                onPress={() => router.push(`/employee/orders/${order.orderNumber}`)}
              >
                <View style={[style.orderCard, { padding: 16 }]}>
                  <View style={[style.orderHeader, { borderBottomWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}>
                    <Text style={style.orderNumber} numberOfLines={1} ellipsizeMode="tail">
                      #{formatOrderNumber(order.orderNumber)} - {order.customerName}
                    </Text>
                    <View style={[style.statusPill, { backgroundColor: status.backgroundColor }]}>
                      <Text style={[style.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                  <Text style={style.orderDate}>
                    {new Date(order.createdAt).toLocaleString("es-MX")}
                  </Text>

                  <View style={style.itemsList}>
                    {order.items.map((item, index) => (
                      <View key={`${item.productId}-${index}`} style={style.itemRow}>
                        <ProductImage
                          contentFit="cover"
                          image={item.image}
                          name={item.name}
                          style={style.itemImage}
                        />
                        <Text style={style.itemQuantity}>{item.quantity}×</Text>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text numberOfLines={2} style={style.itemName}>
                            {item.name}
                          </Text>
                          {item.modifications && item.modifications.length > 0 && (
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                              Mods: {item.modifications.join(", ")}
                            </Text>
                          )}
                          {item.notes ? (
                            <Text style={{ fontSize: 12, color: colors.textSecondary, fontStyle: "italic", marginTop: 2 }}>
                              Nota: {item.notes}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={style.itemPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={style.totalRow}>
                    <Text style={style.totalLabel}>Total</Text>
                    <Text style={style.totalValue}>${order.totalAmount.toFixed(2)}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
      </SafeAreaView>

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
    </View>
  );
}

const style = StyleSheet.create({
  shell: {
    backgroundColor: employee.background,
    flex: 1,
  },
  shellTop: {
    backgroundColor: employee.background,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    overflow: "hidden",
  },
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
  statusCard: {
    backgroundColor: colors.surface,
    borderColor: "#E7E2D8",
    borderRadius: radii.large,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 8,
    marginTop: 8,
    padding: 16,
    ...shadows.card,
  },
  statusTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  statusHalo: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  statusHaloOpen: {
    backgroundColor: "#E5F8EC",
  },
  statusHaloClosed: {
    backgroundColor: "#FDECEC",
  },
  statusCore: {
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  statusCoreOpen: {
    backgroundColor: colors.success,
  },
  statusCoreClosed: {
    backgroundColor: colors.danger,
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statusHint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  hoursLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 16,
    textTransform: "uppercase",
  },
  hoursRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  hourInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.small,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 10,
    textAlign: "center",
  },
  hourInputInvalid: {
    borderColor: colors.danger,
  },
  hoursSeparator: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
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
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  activeFilterText: {
    color: colors.accent,
  },
  filterLine: {
    backgroundColor: "transparent",
    height: 3,
    marginTop: 6,
    width: "100%",
  },
  activeFilterLine: {
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 48,
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
    textAlign: "center",
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
});
