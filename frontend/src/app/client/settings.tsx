/** Ajustes sencillos del cliente. El modo oscuro espera a la animación del círculo. */
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import SafeView from "../../components/SafeView";
import { type Palette } from "../../constants/theme";
import { useColors, useThemeStore } from "../../stores/useTheme";

export default function SettingsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const mode = useThemeStore((state) => state.mode);
  const phase = useThemeStore((state) => state.phase);
  const target = useThemeStore((state) => state.target);
  const animate = useThemeStore((state) => state.animate);
  const requestMode = useThemeStore((state) => state.requestMode);
  const setAnimate = useThemeStore((state) => state.setAnimate);
  const shownMode = phase === "expanding" && target ? target : mode;

  return (
    <SafeView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver al perfil"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons color={colors.text} name="chevron-back" size={24} />
        </Pressable>
        <Text style={styles.title}>Configuración</Text>
      </View>

      <Text style={styles.section}>APARIENCIA</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Modo oscuro</Text>
            <Text style={styles.rowHint}>Negro cálido, más suave de noche.</Text>
          </View>
          <Switch
            accessibilityLabel="Cambiar a modo oscuro"
            disabled={phase === "expanding"}
            onValueChange={(enabled) => requestMode(enabled ? "dark" : "light")}
            thumbColor="#FFFFFF"
            trackColor={{ false: colors.border, true: colors.accent }}
            value={shownMode === "dark"}
          />
        </View>
        
      </View>

      <Text style={styles.section}>GENERAL</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Versión</Text>
            <Text style={styles.rowHint}>TecmiFood 1.0.0</Text>
          </View>
        </View>
      </View>
    </SafeView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 12,
      paddingTop: 8,
    },
    back: {
      alignItems: "center",
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    title: {
      color: colors.text,
      flex: 1,
      fontSize: 28,
      fontWeight: "800",
      marginRight: 44,
      textAlign: "center",
    },
    section: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.2,
      marginBottom: 8,
      marginTop: 28,
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 18,
      borderWidth: 1,
      marginHorizontal: 16,
    },
    row: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    copy: {
      flex: 1,
    },
    rowTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },
    rowHint: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 2,
    },
    divider: {
      backgroundColor: colors.border,
      height: 1,
      marginLeft: 16,
    },
  });
}
