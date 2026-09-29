import { Alert, Pressable, StyleSheet, View, Text } from "react-native";
import { colors } from "../constants/theme";
import { useCafeteriaStatus } from "../stores/useCafeteriaStatus";
import { useColors } from "../stores/useTheme";

// Calcula cuántos minutos faltan para la hora de cierre. Si ya pasó hoy, cuenta hasta mañana.
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

// Convierte esos minutos en una frase: "Faltan 1 h 20 min para que cierre".
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

// Franja que muestra si la cafetería está abierta y, al tocarla, el horario completo.
export function CafeteriaStatusBanner({ cafeteriaKey }: { cafeteriaKey: "busters" | "beesweet" }) {
  const status = useCafeteriaStatus((state) => state[cafeteriaKey]);
  const themeColors = useColors();

  // Abre una alerta con el horario y cuánto falta para cerrar.
  const showSchedule = () => {
    Alert.alert(
      status.isOpen ? "Abierta" : "Cerrada",
      `Horario: ${status.opensAt} a ${status.closesAt}\n${closingMessage(status.closesAt)}`,
    );
  };

  return (
    <Pressable
      accessibilityLabel={status.isOpen ? "Cafetería abierta. Ver horario" : "Cafetería cerrada. Ver horario"}
      accessibilityRole="button"
      hitSlop={8}
      onPress={showSchedule}
      style={styles.hit}
    >
      <View style={[styles.dot, { backgroundColor: status.isOpen ? colors.success : colors.danger }]} />
      <Text style={[styles.text, { color: themeColors.text }]}>{status.isOpen ? "Abierta" : "Cerrada"}</Text>
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
