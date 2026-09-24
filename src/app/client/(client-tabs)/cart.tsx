/** Carrito del cliente. Confirma el pedido y lo envía al API de órdenes. */
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect, useMemo } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Modal,
    Animated,
} from "react-native";
import { FillingCartIcon } from "../../../components/FillingCartIcon";
import SafeView from "../../../components/SafeView";
import { ProductImage } from "../../../components/ProductImage";
import { endpoints } from "../../../constants/api";
import { radii, shadows, type Palette, cafeteriaOptionColors } from "../../../constants/theme";
import { useColors, useThemeStore } from "../../../stores/useTheme";
import { useCafeteriaStatus } from "../../../stores/useCafeteriaStatus";
import { isRealOrder, useOrders } from "../../../stores/useOrders";
import { useCartStore } from "../../../stores/useCartStore";
import { useUserStore } from "../../../stores/useUserStore";
import { clientLabel } from "../../../utils/client";

export default function CartScreen() {
  const colors = useColors();
  const mode = useThemeStore((state) => state.mode);
  const tone = cafeteriaOptionColors[mode];
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const clientId = useUserStore((state) => state.clientId);
  const rememberOrder = useOrders((state) => state.rememberOrder);
  const fetchOrders = useOrders((state) => state.fetchOrders);
  const isOpen = useCafeteriaStatus((state) => state.isOpen);
  const fetchStatus = useCafeteriaStatus((state) => state.fetchStatus);

  useFocusEffect(
    useCallback(() => {
      fetchStatus();
      const statusTimer = setInterval(fetchStatus, 15000);
      return () => clearInterval(statusTimer);
    }, [fetchStatus]),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmCountdown, setConfirmCountdown] = useState(2);
  const [checkoutScope, setCheckoutScope] = useState<"all" | "busters" | "beesweet">("all");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMessage(null));
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    const res = updateQuantity(cartItemId, delta);
    if (!res.success) {
      showToast(res.reason === "product_limit" ? "Límite de 3 por producto alcanzado." : "Límite de 8 productos en total alcanzado.");
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showConfirmModal && confirmCountdown > 0) {
      timer = setTimeout(() => setConfirmCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showConfirmModal, confirmCountdown]);

  const bustersItems = items.filter(i => i.product.businessId === "BT");
  const beeSweetItems = items.filter(i => i.product.businessId === "BS");

  const openConfirmModal = (scope: "all" | "busters" | "beesweet") => {
    if (items.length === 0 || !isOpen) return;
    setCheckoutScope(scope);
    setConfirmCountdown(2);
    setShowConfirmModal(true);
  };

  const handleCheckout = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      await fetchStatus();
      if (!useCafeteriaStatus.getState().isOpen) {
        Alert.alert("Cafetería cerrada", "Solo puedes pedir cuando la cafetería esté abierta.");
        setIsSubmitting(false);
        return;
      }

      await fetchOrders();
      const myOrders = useOrders.getState().orders.filter(o => {
        return o.customerName === clientLabel(useUserStore.getState().clientId);
      });
      
      const activeCount = myOrders.filter(o => o.status !== "Entregado" && o.status !== "Cancelado").length;
      if (activeCount >= 3) {
         Alert.alert("Límite de pedidos", "Solo puedes tener un máximo de 3 pedidos activos al mismo tiempo.");
         setIsSubmitting(false);
         return;
      }
      
      const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;
      const recentOrders = myOrders.filter(o => new Date(o.createdAt).getTime() > thirtyMinsAgo);
      
      // Determine how many orders we are about to create
      const itemsToOrder = checkoutScope === "all" ? items : (checkoutScope === "busters" ? bustersItems : beeSweetItems);
      if (itemsToOrder.length === 0) {
        setIsSubmitting(false);
        return;
      }

      const orderBusters = itemsToOrder.filter(i => i.product.businessId === "BT");
      const orderBeeSweet = itemsToOrder.filter(i => i.product.businessId === "BS");
      
      let numNewOrders = 0;
      if (orderBusters.length > 0) numNewOrders++;
      if (orderBeeSweet.length > 0) numNewOrders++;

      if (recentOrders.length + numNewOrders > 2) {
         Alert.alert("Límite de tiempo", "Has realizado muchos pedidos recientemente. Por favor espera 30 minutos antes de hacer otro pedido.");
         setIsSubmitting(false);
         return;
      }

      const sendOrder = async (orderItems: typeof items) => {
        if (orderItems.length === 0) return null;
        const total = orderItems.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
        const orderData = {
          customerName: clientLabel(clientId),
          totalAmount: total,
          items: orderItems.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            modifications: item.modifications,
            notes: item.notes,
          })),
        };

        const response = await fetch(endpoints.orders, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (response.status === 403) {
          throw new Error("closed");
        }

        if (!response.ok) {
          throw new Error("Error al enviar el pedido");
        }
        
        return await response.json();
      };

      try {
        let lastResult = null;
        if (orderBusters.length > 0) {
          const res = await sendOrder(orderBusters);
          if (res && isRealOrder(res)) {
            rememberOrder(res);
            lastResult = res;
          }
        }
        
        if (orderBeeSweet.length > 0) {
          const res = await sendOrder(orderBeeSweet);
          if (res && isRealOrder(res)) {
            rememberOrder(res);
            lastResult = res;
          }
        }
        
        if (checkoutScope === "all") {
          clearCart();
        } else {
          itemsToOrder.forEach(i => removeItem(i.cartItemId));
        }
        
        fetchOrders();
        
        // If we created two orders, we just go to the regular orders view to see both.
        // If one order, we go to preparing screen.
        if (numNewOrders > 1) {
           router.push("/client/orders");
        } else if (lastResult && isRealOrder(lastResult)) {
          router.push({
            pathname: "/client/preparing",
            params: { id: lastResult._id || String(lastResult.orderNumber) },
          });
        } else {
          router.push("/client/orders");
        }

      } catch (err: any) {
        if (err.message === "closed") {
           Alert.alert("Cafetería cerrada", "Solo puedes pedir cuando la cafetería esté abierta.");
        } else {
           throw err;
        }
      }
    } catch (error) {
      console.error("Error al enviar orden:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al procesar tu pedido. Intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeView edges={["top", "left", "right"]} style={styles.emptyContainer}>
        <FillingCartIcon color={colors.accent} fill={colors.accentSoft} size={108} />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>
          Agrega productos desde las cafeterías para empezar tu pedido.
        </Text>
        <Pressable
          style={styles.browseButton}
          onPress={() => router.push("/client/home")}
        >
          <Text style={styles.browseButtonText}>Ir a comprar</Text>
        </Pressable>
      </SafeView>
    );
  }

  const renderCartItem = (item: typeof items[0]) => (
    <View key={item.cartItemId} style={styles.cartItem}>
      <ProductImage
        contentFit="cover"
        image={item.product.image}
        name={item.product.name}
        style={styles.itemImageContainer}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>
          ${item.product.price.toFixed(2)}
        </Text>

        {item.modifications.length > 0 && (
          <Text style={styles.itemMods}>
            Mods: {item.modifications.join(", ")}
          </Text>
        )}
        {item.notes ? (
          <Text style={styles.itemNotes}>Nota: {item.notes}</Text>
        ) : null}
      </View>

      <View style={styles.quantityControl}>
        <Pressable
          onPress={() => handleUpdateQuantity(item.cartItemId, -1)}
          style={styles.quantityBtn}
        >
          <Ionicons name="remove" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Pressable
          onPress={() => handleUpdateQuantity(item.cartItemId, 1)}
          style={styles.quantityBtn}
        >
          <Ionicons name="add" size={18} color={colors.text} />
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => removeItem(item.cartItemId)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FillingCartIcon color={colors.accent} fill={colors.accentSoft} size={42} />
          <Text style={styles.title}>Tu Carrito</Text>
        </View>
        <Pressable
          onPress={() =>
            Alert.alert("Vaciar carrito", "Se quitarán todos los productos.", [
              { text: "Cancelar", style: "cancel" },
              { text: "Vaciar", style: "destructive", onPress: clearCart },
            ])
          }
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Vaciar</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {bustersItems.length > 0 && (() => {
          const subtotal = bustersItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
          return (
          <View style={[styles.cafeteriaGroup, { backgroundColor: tone.bustersCard }]}>
            <View style={styles.cafeteriaGroupHeader}>
              <Text style={styles.cafeteriaGroupTitle}>BUSTERS</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </View>
            <View style={styles.cafeteriaGroupContent}>
              {bustersItems.map(renderCartItem)}
            </View>
            <Pressable
              style={styles.orderOnlyButton}
              onPress={() => openConfirmModal("busters")}
            >
              <Text style={styles.orderOnlyButtonText}>Ordenar solo Busters | ${subtotal.toFixed(2)}</Text>
            </Pressable>
          </View>
        ); })()}

        {beeSweetItems.length > 0 && (() => {
          const subtotal = beeSweetItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
          return (
          <View style={[styles.cafeteriaGroup, { backgroundColor: tone.beeSweetCard }]}>
            <View style={styles.cafeteriaGroupHeader}>
              <Text style={styles.cafeteriaGroupTitle}>BEE SWEET</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </View>
            <View style={styles.cafeteriaGroupContent}>
              {beeSweetItems.map(renderCartItem)}
            </View>
            <Pressable
              style={styles.orderOnlyButton}
              onPress={() => openConfirmModal("beesweet")}
            >
              <Text style={styles.orderOnlyButtonText}>Ordenar solo Bee Sweet | ${subtotal.toFixed(2)}</Text>
            </Pressable>
          </View>
        ); })()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalValue}>${getTotal().toFixed(2)}</Text>
        </View>

        {!isOpen ? (
          <Text style={styles.closedNote}>La cafetería está cerrada. No se pueden enviar pedidos.</Text>
        ) : null}
        <Pressable
          style={[
            styles.checkoutButton,
            (isSubmitting || !isOpen) && styles.checkoutButtonDisabled,
          ]}
          onPress={() => openConfirmModal("all")}
          disabled={isSubmitting || !isOpen}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>
              {isOpen ? "CONFIRMAR PEDIDO" : "CAFETERÍA CERRADA"}
            </Text>
          )}
        </Pressable>
      </View>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Enviar pedido?</Text>
            <Text style={styles.modalMessage}>Por favor revisa que todo esté correcto antes de confirmar.</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm, confirmCountdown > 0 && styles.modalButtonDisabled]}
                onPress={handleCheckout}
                disabled={confirmCountdown > 0}
              >
                <Text style={styles.modalButtonConfirmText}>
                  {confirmCountdown > 0 ? `Confirmar (${confirmCountdown})` : "Confirmar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {toastMessage && (
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </SafeView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  browseButton: {
    marginTop: 24,
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radii.pill,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "bold",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  cafeteriaGroup: {
    borderRadius: radii.medium,
    overflow: "hidden",
  },
  cafeteriaGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cafeteriaGroupTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.2,
  },
  cafeteriaGroupContent: {
    backgroundColor: colors.surface,
    padding: 12,
    gap: 12,
  },
  orderOnlyButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    alignItems: "center",
  },
  orderOnlyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.medium,
    padding: 12,
    alignItems: "center",
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.small,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  itemPrice: {
    fontSize: 15,
    color: colors.accent,
    marginTop: 2,
  },
  itemMods: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  itemNotes: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityBtn: {
    padding: 6,
    backgroundColor: colors.border,
    borderRadius: radii.small,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 10,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  checkoutButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  closedNote: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: radii.large,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: colors.surfaceMuted,
  },
  modalButtonConfirm: {
    backgroundColor: colors.accent,
  },
  modalButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.7,
  },
  modalButtonCancelText: {
    color: colors.text,
    fontWeight: "600",
  },
  modalButtonConfirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toastContainer: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.large,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  });
}
