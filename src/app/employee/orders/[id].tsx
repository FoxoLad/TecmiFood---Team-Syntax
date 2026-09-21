import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductImageSource } from "../../../constants/images";
import { colors, radii } from "../../../constants/theme";
import { useOrders } from "../../../stores/useOrders";
import {
    ORDER_STATUS_HINTS,
    ORDER_STATUS_LABELS,
    type OrderStatus,
} from "../../../types/order";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivered",
};

const actionLabels: Partial<Record<OrderStatus, { title: string; confirm: string; button: string }>> = {
  pending: {
    button: "Aceptar y empezar a preparar",
    title: "Aceptar pedido",
    confirm: "El cliente verá que su pedido está en preparación.",
  },
  preparing: {
    button: "Marcar listo para recoger",
    title: "Pedido listo",
    confirm: "El cliente recibirá el aviso de que ya puede recogerlo.",
  },
  ready: {
    button: "Confirmar que ya lo recogió",
    title: "Marcar como entregado",
    confirm: "Esto cierra el pedido. Úsalo cuando el cliente ya lo haya recogido.",
  },
};

export default function EmployeeOrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrders((state) => state.orders.find((item) => item.id === id));
  const updateOrderStatus = useOrders((state) => state.updateOrderStatus);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons color={colors.text} name="chevron-back" size={28} />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
        <Text style={styles.notFound}>No encontramos este pedido.</Text>
      </SafeAreaView>
    );
  }

  const action = actionLabels[order.status];
  const upcomingStatus = nextStatus[order.status];

  const confirmStatusChange = () => {
    if (!upcomingStatus) {
      setShowConfirmation(false);
      return;
    }

    updateOrderStatus(order.id, upcomingStatus);
    setShowConfirmation(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Volver a la lista de pedidos"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons color={colors.text} name="chevron-back" size={28} />
            <Text style={styles.backText}>Pedidos</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Pedido #{String(order.orderNumber).padStart(3, "0")}</Text>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.orderDate}>
          {new Date(order.createdAt).toLocaleString("es-MX")}
        </Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Estado</Text>
          <Text
            style={[
              styles.statusValue,
              order.status === "ready" && styles.readyStatus,
              order.status === "delivered" && styles.deliveredStatus,
            ]}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </Text>
        </View>
        <Text style={styles.statusHint}>{ORDER_STATUS_HINTS[order.status]}</Text>

        {order.items.map((item, index) => (
          <View key={`${item.product.id}-${index}`} style={styles.productCard}>
            <Image
              source={getProductImageSource(item.product.image)}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.quantity}>x{item.quantity}</Text>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.description}>
                {item.product.description || "Sin descripción"}
              </Text>
              <Text style={styles.price}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
              {item.modifications.length > 0 ? (
                <View style={styles.modificationsBox}>
                  <Text style={styles.modificationsTitle}>Cambios del cliente</Text>
                  <Text style={styles.modificationsText}>{item.modifications.join(" · ")}</Text>
                </View>
              ) : null}
              {item.notes ? (
                <View style={styles.modificationsBox}>
                  <Text style={styles.modificationsTitle}>Notas</Text>
                  <Text style={styles.modificationsText}>{item.notes}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ))}

        <View style={styles.totalBar}>
          <Text style={styles.totalText}>Total: ${order.total.toFixed(2)}</Text>
        </View>

        {action ? (
          <Pressable
            accessibilityLabel={action.button}
            accessibilityRole="button"
            onPress={() => setShowConfirmation(true)}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>{action.button}</Text>
          </Pressable>
        ) : (
          <Text style={styles.completedNote}>Este pedido ya fue entregado.</Text>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
        transparent
        visible={showConfirmation}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>{action?.title}</Text>
            <Text style={styles.modalMessage}>{action?.confirm}</Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowConfirmation(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={confirmStatusChange} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 8,
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 2,
    paddingVertical: 6,
  },
  backText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  customerName: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
  },
  orderDate: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  statusRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  statusValue: {
    color: "#f27600",
    fontSize: 16,
    fontWeight: "700",
  },
  readyStatus: {
    color: "#15803d",
  },
  deliveredStatus: {
    color: colors.textSecondary,
  },
  statusHint: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.medium,
    borderWidth: 1,
    marginTop: 14,
    overflow: "hidden",
  },
  productImage: {
    backgroundColor: "#F8F3E8",
    height: 160,
    resizeMode: "cover",
    width: "100%",
  },
  productDetails: {
    padding: 14,
  },
  quantity: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "800",
  },
  productName: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
  },
  modificationsBox: {
    backgroundColor: "#fff8e7",
    borderColor: "#d6b77a",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  modificationsTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  modificationsText: {
    color: "#444444",
    fontSize: 15,
    marginTop: 3,
  },
  totalBar: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 16,
    marginTop: 16,
    paddingVertical: 12,
  },
  totalText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#15803d",
    borderRadius: 16,
    marginTop: 14,
    paddingVertical: 14,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  completedNote: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 16,
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
    backgroundColor: "#15803d",
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  notFound: {
    fontSize: 18,
    marginTop: 30,
    textAlign: "center",
  },
});
