/** Punto de estado en Busters. El horario y el tiempo restante salen al tocarlo. */
import { Alert, Pressable, StyleSheet, View, Text } from "react-native";
import { colors } from "../constants/theme";
import { useCafeteriaStatus } from "../stores/useCafeteriaStatus";
import { useColors } from "../stores/useTheme";

function minutesUntilClose(closesAt: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(closesAt);
  if (!match) {
    return null;
  }
  const now = new Date();
  const target = new Date(now);
  target.setHours(Number(match[1]), Number(match[2]), 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return Math.max(1, Math.ceil((target.getTime() - now.getTime()) / 60000));
}

function closingMessage(closesAt: string) {
  const minutes = minutesUntilClose(closesAt);
  if (minutes === null) {
    return `Cierra a las ${closesAt}`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return rest === 1 ? "Falta 1 min para que cierre" : `Faltan ${rest} min para que cierre`;
  }
  if (rest === 0) {
    return hours === 1 ? "Falta 1 h para que cierre" : `Faltan ${hours} h para que cierre`;
  }
  const hourLabel = hours === 1 ? "1 h" : `${hours} h`;
  const minuteLabel = rest === 1 ? "1 min" : `${rest} min`;
  return `Faltan ${hourLabel} ${minuteLabel} para que cierre`;
}

export function CafeteriaStatusBanner() {
  const isOpen = useCafeteriaStatus((state) => state.isOpen);
  const opensAt = useCafeteriaStatus((state) => state.opensAt);
  const closesAt = useCafeteriaStatus((state) => state.closesAt);
  const themeColors = useColors();

  const showSchedule = () => {
    Alert.alert(
      isOpen ? "Abierta" : "Cerrada",
      `Horario: ${opensAt} a ${closesAt}\n${closingMessage(closesAt)}`,
    );
  };

  return (
    <Pressable
      accessibilityLabel={isOpen ? "Cafetería abierta. Ver horario" : "Cafetería cerrada. Ver horario"}
      accessibilityRole="button"
      hitSlop={8}
      onPress={showSchedule}
      style={styles.hit}
    >
      <View style={[styles.dot, { backgroundColor: isOpen ? colors.success : colors.danger }]} />
      <Text style={[styles.text, { color: themeColors.text }]}>{isOpen ? "Abierta" : "Cerrada"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    borderRadius: 8,
    height: 12,
    width: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  }
});
