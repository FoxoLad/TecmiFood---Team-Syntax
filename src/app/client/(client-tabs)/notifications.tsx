import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import SafeView from "../../../components/SafeView";
import { colors, radii, spacing } from "../../../constants/theme";
import { useOrders } from "../../../stores/useOrders";
import { useUserStore } from "../../../stores/useUserStore";

const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
  if (status === "Pendiente") return "receipt-outline";
  if (status === "En preparación") return "restaurant-outline";
  if (status === "Terminado") return "checkmark-circle-outline";
  return "checkmark-done-outline";
};

const getStatusMessage = (status: string, orderNumber: string) => {
  if (status === "Pendiente") return `Hemos recibido tu pedido #${orderNumber}.`;
  if (status === "En preparación") return `Tu pedido #${orderNumber} ya se está preparando.`;
  if (status === "Terminado") return `¡Tu pedido #${orderNumber} está listo para recoger!`;
  return `Tu pedido #${orderNumber} ha sido entregado.`;
};

export default function NotificationsScreen() {
  const clientId = useUserStore((state) => state.clientId);
  const notificationsClearedAt = useUserStore((state) => state.notificationsClearedAt);
  const clearNotifications = useUserStore((state) => state.clearNotifications);
  const orders = useOrders((state) => state.orders);
  
  const alerts = orders
    .filter(o => o.customerName === `Usuario ${clientId}` && (!notificationsClearedAt || new Date(o.updatedAt).getTime() > notificationsClearedAt))
    .map(order => ({
      id: order._id,
      status: order.status,
      title: order.status === "Terminado" ? "¡Pedido Listo!" : `Pedido ${order.status}`,
      body: getStatusMessage(order.status, String(order.orderNumber).padStart(3, "0")),
      date: new Date(order.updatedAt).toLocaleString("es-MX"),
    }));

  return (
    <SafeView style={styles.container}>
      <View style={[styles.header, { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.eyebrow}>ACTUALIZACIONES</Text>
          <Text style={styles.title}>Avisos</Text>
          <Text style={styles.subtitle}>Te avisamos cada vez que tu pedido cambie de estado.</Text>
        </View>
        {alerts.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpiar avisos"
            onPress={() => {
              Alert.alert(
                "Borrar avisos",
                "¿Estás seguro de que deseas borrar todos tus avisos?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Aceptar", style: "destructive", onPress: () => clearNotifications() }
                ]
              );
            }}
            style={{ padding: 10, backgroundColor: colors.surface, borderRadius: radii.pill }}
          >
            <Ionicons name="trash-outline" size={24} color={colors.danger} />
          </Pressable>
        )}
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons color={colors.accent} name="notifications-outline" size={42} />
          </View>
          <Text style={styles.emptyTitle}>Todavía no hay avisos</Text>
          <Text style={styles.emptyMessage}>
            Cuando tu pedido se reciba, se prepare o esté listo, te llegará aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={alerts}
          keyExtractor={(alert) => alert.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.notificationCard}
              onPress={() => router.push(`/client/preparing?id=${item.id}`)}
            >
              <View style={styles.notificationIcon}>
                <Ionicons color={colors.accent} name={getStatusIcon(item.status)} size={24} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationBody}>{item.body}</Text>
                <Text style={styles.notificationDate}>{item.date}</Text>
              </View>
            </Pressable>
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  listContent: {
    gap: 12,
    padding: spacing.screen,
  },
  notificationCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#E7E2D8",
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    flexDirection: "row",
    padding: 16,
    shadowColor: "#302512",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
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
  notificationBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
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
