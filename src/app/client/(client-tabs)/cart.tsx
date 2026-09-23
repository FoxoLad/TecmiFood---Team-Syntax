/** Carrito del cliente. Confirma el pedido y lo envía al API de órdenes. */
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Modal,
} from "react-native";
import SafeView from "../../../components/SafeView";
import { ProductImage } from "../../../components/ProductImage";
import { endpoints } from "../../../constants/api";
import { colors, radii, shadows } from "../../../constants/theme";
import { useCafeteriaStatus } from "../../../stores/useCafeteriaStatus";
import { isRealOrder, useOrders } from "../../../stores/useOrders";
import { useCartStore } from "../../../stores/useCartStore";
import { useUserStore } from "../../../stores/useUserStore";
import { clientLabel } from "../../../utils/client";

export default function CartScreen() {
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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showConfirmModal && confirmCountdown > 0) {
      timer = setTimeout(() => setConfirmCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showConfirmModal, confirmCountdown]);

  const openConfirmModal = () => {
    if (items.length === 0 || !isOpen) return;
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
        return;
      }
      //Preparar los datos según el modelo Order.js en el backend
      const orderData = {
        customerName: clientLabel(clientId),
        totalAmount: getTotal(),
        items: items.map((item) => ({
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
        Alert.alert("Cafetería cerrada", "Solo puedes pedir cuando la cafetería esté abierta.");
        return;
      }

      if (!response.ok) {
        throw new Error("Error al enviar el pedido");
      }

      const result: unknown = await response.json();
      if (isRealOrder(result)) {
        rememberOrder(result);
      }
      clearCart();
      fetchOrders();
      if (isRealOrder(result)) {
        router.replace({
          pathname: "/client/preparing",
          params: { id: result._id || String(result.orderNumber) },
        });
        return;
      }
      router.replace("/client/preparing");
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
      <SafeView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color={colors.textSecondary} />
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

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Carrito</Text>
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
        {items.map((item) => (
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
                onPress={() => updateQuantity(item.cartItemId, -1)}
                style={styles.quantityBtn}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </Pressable>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <Pressable
                onPress={() => updateQuantity(item.cartItemId, 1)}
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
        ))}
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
          onPress={openConfirmModal}
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
    </SafeView>
  );
}

const styles = StyleSheet.create({
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
    gap: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.medium,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
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
});
