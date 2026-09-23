import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import SafeView from "../../../components/SafeView";
import { colors, radii } from "../../../constants/theme";
import { useCartStore } from "../../../stores/useCartStore";
import { useUserStore } from "../../../stores/useUserStore";

export default function CartScreen() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const clientId = useUserStore((state) => state.clientId) || "Cliente Anónimo";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      //Preparar los datos según el modelo Order.js en el backend
      const orderData = {
        customerName: `Usuario ${clientId}`, //Identificador único
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

      const response = await fetch(
        "https://tecmifood-team-syntax.onrender.com/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        },
      );

      if (!response.ok) {
        throw new Error("Error al enviar el pedido");
      }

      const result = await response.json();

      Alert.alert(
        "¡Pedido Enviado!",
        `Tu número de orden es: #${result.orderNumber}`,
        [
          {
            text: "Ver Menú",
            onPress: () => {
              clearCart();
              router.push("/client/home");
            },
          },
        ],
      );
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
        <Pressable onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Vaciar</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.cartItemId} style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
              {item.product.image ? (
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.itemImage}
                />
              ) : (
                <Ionicons
                  name="fast-food-outline"
                  size={24}
                  color={colors.textSecondary}
                />
              )}
            </View>
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

        <Pressable
          style={[
            styles.checkoutButton,
            isSubmitting && styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>HACER PEDIDO</Text>
          )}
        </Pressable>
      </View>
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
  itemImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
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
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
