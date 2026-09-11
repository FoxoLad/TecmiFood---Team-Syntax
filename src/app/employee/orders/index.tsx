import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { productsImages } from "../../../constants/images";
import { colors, radii } from "../../../constants/theme";
import { useProductStore } from "../../../stores/useProduct";
import type { Product } from "../../../types/product";

export default function EmployeeOrdersScreen() {
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState("Pendientes");
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts]);

  const filteredProducts = products.filter((item: Product) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesOrder = String(item.NoOrder ?? "").includes(query);
    const normalizedStatus = (item.status || "active").toLowerCase().trim();
    const isDelivered =
      normalizedStatus === "entregado" || normalizedStatus === "delivered";
    const matchesStatus =
      selectedFilter === "Todos" ||
      (selectedFilter === "Entregados" ? isDelivered : !isDelivered);
    return (matchesName || matchesOrder) && matchesStatus;
  });

  const orders = Object.values(
    filteredProducts.reduce<Record<number, Product[]>>((grouped, product) => {
      const key = product.NoOrder || 0;
      const orderProducts = grouped[key] ?? [];
      grouped[key] = [...orderProducts, product];
      return grouped;
    }, {}),
  );

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
          <View style={style.headerSpacer} />
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

        {isLoading ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Cargando órdenes...
            </Text>
          </View>
        ) : (
          orders.map((orderProducts) => {
            const orderNumber = orderProducts[0].NoOrder;
            const total = orderProducts.reduce(
              (sum, product) => sum + product.price,
              0,
            );
            const isDeliveredView = selectedFilter === "Entregados";
            const orderStatus = (orderProducts[0].status || "active")
              .toLowerCase()
              .trim();
            const displayStatus =
              orderStatus === "active" || orderStatus === "pending"
                ? "Pendiente"
                : orderProducts[0].status || "Pendiente";

            return (
              <View
                key={orderNumber}
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
                    #{String(orderNumber).padStart(3, "0")}
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

                {orderProducts.map((product) => (
                  <Pressable
                    accessibilityLabel={`Ver detalles de la orden ${orderNumber}`}
                    accessibilityRole="button"
                    key={product.id}
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
                        style.productTextRow,
                        isDeliveredView && style.deliveredProductTextRow,
                      ]}
                    >
                      <Text
                        style={[
                          style.quantity,
                          isDeliveredView && style.deliveredQuantity,
                        ]}
                      >
                        x1
                      </Text>
                      <View style={style.productInfo}>
                        <Text
                          style={[
                            style.productName,
                            isDeliveredView && style.deliveredProductName,
                          ]}
                        >
                          {product.name}
                        </Text>
                        {!isDeliveredView ? (
                          <>
                            <Text style={style.description}>
                              {product.description}
                            </Text>
                            <Text style={style.category}>
                              {product.category.toUpperCase()}
                            </Text>
                            <Text style={style.price}>
                              ${product.price.toFixed(2)}
                            </Text>
                          </>
                        ) : null}
                      </View>
                    </View>
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
                  </Pressable>
                ))}

                <View
                  style={[
                    style.totalBar,
                    isDeliveredView && style.deliveredTotalBar,
                  ]}
                >
                  <Text
                    style={[
                      style.totalText,
                      isDeliveredView && style.deliveredTotalText,
                    ]}
                  >
                    Total: ${total.toFixed(2)}
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
  },
  deliveredOrderHeader: {
    paddingVertical: 2,
  },
  orderNumber: {
    fontSize: 38,
    fontWeight: "800",
  },
  deliveredOrderNumber: {
    fontSize: 27,
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
    alignItems: "center",
    borderBottomColor: "#111110",
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 116,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  deliveredProductRow: {
    minHeight: 78,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  quantity: {
    alignSelf: "flex-start",
    fontSize: 23,
    fontWeight: "700",
    marginTop: 6,
    width: 38,
  },
  deliveredQuantity: {
    alignSelf: "flex-start",
    fontSize: 17,
    marginTop: 0,
    width: 27,
  },
  productTextRow: {
    flex: 1,
    flexDirection: "row",
  },
  deliveredProductTextRow: {
    alignItems: "flex-start",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 22,
    fontWeight: "800",
  },
  deliveredProductName: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
  },
  category: {
    color: "#777777",
    fontSize: 11,
    marginTop: 3,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  productActions: {
    alignItems: "center",
    width: 125,
  },
  deliveredProductActions: {
    width: 88,
  },
  productImage: {
    height: 88,
    resizeMode: "contain",
    width: 118,
  },
  deliveredProductImage: {
    height: 65,
    width: 82,
  },
  totalBar: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 22,
    marginHorizontal: 17,
    marginVertical: 9,
    paddingVertical: 3,
  },
  deliveredTotalBar: {
    borderRadius: 15,
    marginHorizontal: 12,
    marginVertical: 5,
    paddingVertical: 1,
  },
  totalText: {
    color: "#ffffff",
    fontSize: 29,
    fontWeight: "800",
  },
  deliveredTotalText: {
    fontSize: 20,
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
