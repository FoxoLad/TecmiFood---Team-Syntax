/** Barra cálida que identifica todas las pantallas del empleado. */
import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { employee } from "../constants/theme";

type EmployeeHeaderProps = {
  title: string;
  onBack: () => void;
  backLabel?: string;
  right?: ReactNode;
};

export function EmployeeHeader({
  title,
  onBack,
  backLabel = "Cliente",
  right,
}: EmployeeHeaderProps) {
  return (
    <View style={styles.bar}>
      <Text style={styles.kicker}>MODO COCINA</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={backLabel}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.back}
        >
          <Ionicons color={employee.text} name="chevron-back" size={22} />
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: employee.background,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  kicker: {
    color: employee.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 6,
    textAlign: "center",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 36,
  },
  back: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: 88,
  },
  backText: {
    color: employee.text,
    fontSize: 15,
    fontWeight: "700",
  },
  title: {
    color: employee.text,
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  right: {
    alignItems: "flex-end",
    minWidth: 88,
  },
});
