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
import { productsImages } from "../../../constants/images";
import { colors, radii } from "../../../constants/theme";
import { useOrders } from "../../../stores/useOrders";

export default function EmployeeOrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, updateOrderStatus } = useOrders();
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);
  
  const order = orders.find((o) => String(o.orderNumber) === id);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons color="#111110" name="chevron-back" size={30} />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
        <Text style={styles.notFound}>Pedido no encontrado</Text>
      </SafeAreaView>
    );
  }

  const orderNumber = order.orderNumber;

  let action: any = null;
  if (order.status === "Pendiente") {
    action = {
      button: "Comenzar a preparar",
      title: "Preparar pedido",
      confirm: "¿Confirmas que vas a empezar a preparar este pedido?",
      nextStatus: "En preparación"
    };
  } else if (order.status === "En preparación") {
    action = {
      button: "Marcar como terminado",
      title: "Terminar pedido",
      confirm: "Se le enviará un aviso al cliente de que su pedido está listo para recoger.",
      nextStatus: "Terminado"
    };
  } else if (order.status === "Terminado") {
    action = {
      button: "Entregar pedido",
      title: "Entregar al cliente",
      confirm: "Asegúrate de haber cobrado o validado el pago antes de entregar.",
      nextStatus: "Entregado"
    };
  }

  const confirmStatusChange = () => {
    if (action && action.nextStatus) {
      updateOrderStatus(orderNumber, action.nextStatus);
    }
    setShowDeliveryConfirmation(false);
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
              order.status === "Entregado" && styles.deliveredStatus,
            ]}
          >
            {order.status}
          </Text>
        </View>

        {order.items.map((product, idx) => (
          <View key={`${product.productId}-${idx}`} style={styles.productCard}>
            {product.image?.startsWith("http") ? (
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
            ) : product.image &&
              productsImages[product.image as keyof typeof productsImages] ? (
              <Image
                source={
                  productsImages[product.image as keyof typeof productsImages]
                }
                style={styles.productImage}
              />
            ) : (
              <View
                style={[
                  styles.productImage,
                  { backgroundColor: "#f0f0f0", borderRadius: 8 },
                ]}
              />
            )}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.quantity}x {product.name}</Text>
              <Text style={styles.price}>${(product.price * product.quantity).toFixed(2)}</Text>
            </View>
            <View style={styles.modificationsBox}>
              <Text style={styles.modificationsTitle}>Modificaciones / Notas</Text>
              <Text style={styles.modificationsText}>
                {product.modifications && product.modifications.length > 0 
                  ? product.modifications.join(", ") 
                  : "Sin modificaciones"}
              </Text>
              {product.notes ? (
                  <Text style={[styles.modificationsText, { marginTop: 4, fontStyle: 'italic' }]}>
                    Nota: {product.notes}
                  </Text>
              ) : null}
            </View>
          </View>
        ))}

        <Pressable
          onPress={() => setShowDeliveryConfirmation(true)}
          style={styles.deliverButton}
        >
          <Text style={styles.deliverButtonText}>ENTREGAR</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowDeliveryConfirmation(false)}
        transparent
        visible={showDeliveryConfirmation}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmationModal}>
            <Text style={styles.modalTitle}>Entregar producto</Text>
            <Text style={styles.modalMessage}>
              Este producto pasará a estar en entregado. ¿Seguro que deseas
              continuar?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowDeliveryConfirmation(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={deliverOrder} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Continuar</Text>
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
    padding: 14,
    paddingBottom: 28,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 14,
  },
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    paddingVertical: 6,
  },
  backText: {
    color: "#111110",
    fontSize: 17,
    fontWeight: "700",
  },
  title: {
    flex: 1,
    fontSize: 27,
    fontWeight: "900",
    textAlign: "right",
  },
  statusRow: {
    alignItems: "center",
    backgroundColor: "#EDE6CE",
    borderColor: "#111110",
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: "800",
  },
  statusValue: {
    color: "#f27600",
    fontSize: 18,
    fontWeight: "700",
  },
  deliveredStatus: {
    color: "#15803d",
  },
  productCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.medium,
    borderWidth: 1.5,
    marginBottom: 12,
    padding: 12,
  },
  productImage: {
    alignSelf: "center",
    height: 130,
    resizeMode: "contain",
    width: "100%",
  },
  productDetails: {
    marginTop: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "900",
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4,
  },
  category: {
    color: "#777777",
    fontSize: 12,
    marginTop: 6,
  },
  price: {
    fontSize: 23,
    fontWeight: "800",
    marginTop: 3,
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
    fontSize: 16,
    fontWeight: "900",
  },
  modificationsText: {
    color: "#444444",
    fontSize: 16,
    marginTop: 3,
  },
  deliverButton: {
    alignItems: "center",
    backgroundColor: "#15803d",
    borderRadius: 22,
    marginTop: 2,
    paddingVertical: 7,
  },
  deliverButtonText: {
    color: "#ffffff",
    fontSize: 29,
    fontWeight: "900",
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
