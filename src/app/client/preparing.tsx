/** Seguimiento visual del pedido que el cliente acaba de enviar o abrió desde avisos. */
import { useMemo } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SafeView from "../../components/SafeView";
import { radii, spacing, type Palette } from "../../constants/theme";
import { useColors } from "../../stores/useTheme";
import { useOrders } from "../../stores/useOrders";
import { formatOrderNumber, getOrderStatusHint, getOrderStatusLabel } from "../../types/order";

const STEPS = ["Pendiente", "En preparación", "Terminado"];

export default function PreparingOrderScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const orders = useOrders((state) => state.orders);
  const latestOrder = id
    ? orders.find((order) => order._id === id || String(order.orderNumber) === id)
    : undefined;
  const status = latestOrder?.status ?? "Pendiente";
  const isReady = status === "Terminado" || status === "Entregado";
  const stepStatus = status === "Entregado" ? "Terminado" : status;
  const stepIndex = STEPS.indexOf(stepStatus);
  const currentIndex = stepIndex < 0 ? 0 : stepIndex;

  return (
    <SafeView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Pressable
            accessibilityLabel="Cerrar ventana"
            accessibilityRole="button"
            onPress={() => router.replace("/client/(client-tabs)/home")}
            style={styles.closeButton}
          >
            <Ionicons color={colors.textSecondary} name="close" size={24} />
          </Pressable>
          <View style={styles.iconCircle}>
            <Ionicons
            color={colors.accent}
            name={isReady ? "checkmark-circle-outline" : "restaurant-outline"}
            size={52}
          />
        </View>
        <Text style={styles.title}>
          {latestOrder
            ? `Pedido #${formatOrderNumber(latestOrder.orderNumber)}`
            : "Pedido enviado"}
        </Text>
        <Text style={styles.statusLabel}>{getOrderStatusLabel(status)}</Text>
        <Text style={styles.message}>
          {latestOrder ? getOrderStatusHint(status) : "Recibimos tu pedido. Te avisaremos cuando esté listo."}
        </Text>

        {latestOrder ? (
          <View style={styles.steps}>
            {STEPS.map((step, index) => {
              const complete = index <= currentIndex;

              return (
                <View key={step} style={styles.stepRow}>
                  <View style={[styles.stepDot, complete && styles.stepDotComplete]} />
                  <Text style={[styles.stepText, complete && styles.stepTextComplete]}>
                    {getOrderStatusLabel(step)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        <Pressable
          accessibilityLabel="Ver mis pedidos"
          accessibilityRole="button"
          onPress={() => router.replace("/client/orders")}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>Ver mis pedidos</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Volver al inicio"
          accessibilityRole="button"
          onPress={() => router.replace("/client/(client-tabs)/home")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
        </Pressable>
        </View>
      </View>
    </SafeView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.screen,
  },
  card: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 360,
    padding: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
    zIndex: 10,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 112,
    justifyContent: "center",
    width: 112,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginTop: 24,
    maxWidth: 320,
    textAlign: "center",
  },
  statusLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 310,
    textAlign: "center",
  },
  steps: {
    alignSelf: "stretch",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginTop: 24,
    maxWidth: 360,
    padding: 16,
  },
  stepRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  stepDot: {
    backgroundColor: colors.border,
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  stepDotComplete: {
    backgroundColor: colors.success,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  stepTextComplete: {
    color: colors.text,
    fontWeight: "800",
  },
  homeButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    marginTop: 28,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  });
}
