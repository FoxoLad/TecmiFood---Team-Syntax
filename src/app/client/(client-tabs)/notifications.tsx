import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import SafeView from "../../../components/SafeView";
import { colors, radii, spacing } from "../../../constants/theme";
import { useOrders } from "../../../stores/useOrders";
import type { OrderStatus } from "../../../types/order";

const statusLabels: Record<OrderStatus, string> = {
  delivered: "Pedido entregado",
  pending: "Pedido recibido",
  preparing: "Tu pedido se está preparando",
  ready: "Tu pedido está listo",
};

export default function NotificationsScreen() {
  const orders = useOrders((state) => state.orders);

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ACTUALIZACIONES</Text>
        <Text style={styles.title}>Notificaciones</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons color={colors.accent} name="notifications-outline" size={42} />
          </View>
          <Text style={styles.emptyTitle}>No tienes notificaciones</Text>
          <Text style={styles.emptyMessage}>
            Aquí verás las actualizaciones de tus pedidos.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={orders}
          keyExtractor={(order) => order.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.notificationCard}>
              <View style={styles.notificationIcon}>
                <Ionicons color={colors.accent} name="restaurant-outline" size={24} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>
                  {statusLabels[item.status]}
                </Text>
                <Text style={styles.notificationMessage}>
                  Orden #{String(orders.length - index).padStart(3, "0")} · ${item.total.toFixed(2)}
                </Text>
                <Text style={styles.notificationDate}>
                  {new Date(item.createdAt).toLocaleString("es-MX")}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
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
  listContent: {
    gap: 12,
    padding: spacing.screen,
  },
  notificationCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    padding: 16,
  },
  notificationIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 13,
  },
  notificationTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  notificationMessage: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },
  notificationDate: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 7,
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