import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import SafeView from "../../../components/SafeView";
import { getProductImageSource } from "../../../constants/images";
import { colors, radii, spacing } from "../../../constants/theme";
import { useCartStore } from "../../../stores/useCart";

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TU PEDIDO</Text>
          <Text style={styles.title}>Mi carrito</Text>
        </View>
        {itemCount > 0 ? (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{itemCount}</Text>
          </View>
        ) : null}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={42} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyMessage}>
            Agrega tus productos favoritos y aparecerán aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={(item, index) => `${item.product.id}-${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.itemCard}>
                <Image
                  source={getProductImageSource(item.product.image)}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text numberOfLines={2} style={styles.productName}>
                    {item.product.name}
                  </Text>
                  <Text numberOfLines={2} style={styles.descriptionText}>
                    {item.product.description || "Sin descripción disponible."}
                  </Text>
                  {item.modifications.length > 0 ? (
                    <Text numberOfLines={2} style={styles.detailsText}>
                      {item.modifications.join(" · ")}
                    </Text>
                  ) : null}
                  <View style={styles.itemFooter}>
                    <Text style={styles.unitPrice}>${item.product.price.toFixed(2)} c/u</Text>
                  </View>
                </View>
                <View style={styles.actionColumn}>
                  <Pressable
                    accessibilityLabel={`Eliminar ${item.product.name} del carrito`}
                    accessibilityRole="button"
                    onPress={() => removeItem(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                  <View style={styles.itemControls}>
                    <View style={styles.quantityControl}>
                      <Pressable
                        accessibilityLabel={`Disminuir cantidad de ${item.product.name}`}
                        accessibilityRole="button"
                        disabled={item.quantity === 1}
                        onPress={() => updateQuantity(index, item.quantity - 1)}
                        style={styles.quantityButton}
                      >
                        <Ionicons
                          color={item.quantity === 1 ? colors.border : colors.text}
                          name="remove"
                          size={16}
                        />
                      </Pressable>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <Pressable
                        accessibilityLabel={`Aumentar cantidad de ${item.product.name}`}
                        accessibilityRole="button"
                        onPress={() => updateQuantity(index, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        <Ionicons color={colors.text} name="add" size={16} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      {items.length > 0 ? (
        <View style={styles.totalPanel}>
          <View>
            <Text style={styles.totalLabel}>Total del pedido</Text>
            <Text style={styles.totalHint}>{itemCount} productos</Text>
          </View>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      ) : null}
    </SafeView>
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
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: 10,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 2,
  },
  countBadge: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    height: 36,
    justifyContent: "center",
    minWidth: 36,
    paddingHorizontal: 10,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  listContent: {
    gap: 12,
    paddingHorizontal: spacing.screen,
    paddingTop: 18,
    paddingBottom: 28,
  },
  itemCard: {
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderColor: "#E7E2D8",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
    shadowColor: "#302512",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    backgroundColor: "#F8F3E8",
    borderRadius: 14,
    height: 94,
    width: 94,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 13,
    paddingTop: 1,
  },
  actionColumn: {
    alignItems: "center",
    paddingTop: 1,
    width: 70,
  },
  productName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
  },
  removeButton: {
    alignItems: "center",
    backgroundColor: "#FFF1F0",
    borderRadius: 10,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  itemControls: {
    alignItems: "center",
    marginTop: 10,
  },
  quantityControl: {
    alignItems: "center",
    backgroundColor: "#F4F1EB",
    borderRadius: 10,
    flexDirection: "row",
    height: 34,
  },
  quantityButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 25,
  },
  quantityText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    minWidth: 20,
    textAlign: "center",
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  detailsText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  itemFooter: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13,
  },
  unitPrice: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  totalPanel: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: spacing.screen,
    paddingTop: 14,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  totalHint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  totalValue: {
    color: colors.accent,
    fontSize: 25,
    fontWeight: "900",
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 36,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 86,
    justifyContent: "center",
    width: 86,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 18,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 280,
    textAlign: "center",
  },
});