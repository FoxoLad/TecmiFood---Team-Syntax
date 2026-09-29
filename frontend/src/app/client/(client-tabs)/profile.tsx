//Perfil del usuario y acceso del empleado con un código local
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SafeView from "../../../components/SafeView";
import {
  employee,
  employeeOnDark,
  radii,
  type Palette,
} from "../../../constants/theme";
import { useColors, useThemeStore } from "../../../stores/useTheme";
import { useUserStore } from "../../../stores/useUserStore";

export default function ProfileScreen() {
  const colors = useColors();
  const mode = useThemeStore((state) => state.mode);
  const kitchen = mode === "dark" ? employeeOnDark : employee;
  const styles = useMemo(
    () => createStyles(colors, kitchen),
    [colors, kitchen],
  );
  const [employeeCode, setEmployeeCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const router = useRouter();
  const clientId = useUserStore((state) => state.clientId);

  const openActiveOrders = () =>
    router.push("/client/orders?view=active" as Href);
  const openOrderHistory = () =>
    router.push("/client/orders?view=history" as Href);
  const openFavorites = () => router.push("/client/favorites");
  const openSettings = () => router.push("/client/settings" as Href);

  //Claves de acceso a la vista de empleado para cada cafetería
  //Hardcodeado mientras no hay nada que tenga que ver con cyberseguridad
  const BUSTERS_CODE = "11111";
  const BEESWEET_CODE = "22222";

  //Control de accesos a la vista de empleado para cada cafetería
  const accessEmployeeOrders = () => {
    const code = employeeCode.trim();

    let cafeteriaId = null;
    if (code === BUSTERS_CODE) {
      cafeteriaId = "Busters";
    } else if (code === BEESWEET_CODE) {
      cafeteriaId = "Bee Sweet";
    }

    if (cafeteriaId) {
      setCodeError(false);
      useUserStore.getState().setEmployeeCafeteria(cafeteriaId);
      setEmployeeCode("");
      Keyboard.dismiss();
      router.push("/employee/orders");
      return;
    }

    setCodeError(true);
  };

  //INTERFAZ Y DISEÑO DE LA PANTALLA DEL PERFIL
  return (
    <SafeView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoider}
      >
        <Pressable
          accessible={false}
          onPress={Keyboard.dismiss}
          style={styles.container}
        >
          <View>
            <Text style={styles.kicker}>MI CUENTA</Text>
            <Text style={styles.title}>Mi perfil</Text>
          </View>

          <Text style={styles.userName}>Usuario {clientId || ""}</Text>

          <View style={styles.cardsRow}>
            <Pressable
              accessibilityLabel="Ver pedidos activos"
              accessibilityRole="button"
              onPress={openActiveOrders}
              style={({ pressed }) => [
                styles.smallCard,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cardTitle}>Pedidos Activos</Text>
              <View style={styles.iconCircle}>
                <Ionicons color={colors.accent} name="cart-outline" size={32} />
              </View>
              <Text style={styles.cardDescription}>
                Sigue el estado de tus pedidos
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Ver historial de pedidos"
              accessibilityRole="button"
              onPress={openOrderHistory}
              style={({ pressed }) => [
                styles.smallCard,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cardTitle}>Historial</Text>
              <View style={styles.iconCircle}>
                <Ionicons color={colors.accent} name="time-outline" size={32} />
              </View>
              <Text style={styles.cardDescription}>
                Ver detalles de tus pedidos anteriores
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityLabel="Ver mis favoritos"
            accessibilityRole="button"
            onPress={openFavorites}
            style={({ pressed }) => [
              styles.favoritesCard,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.cardTitle}>Mis Favoritos</Text>
            <View style={styles.iconCircle}>
              <Ionicons color="#ef1d25" name="heart-outline" size={42} />
            </View>
            <Text style={styles.cardDescription}>Tus productos guardados</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Abrir configuración"
            accessibilityRole="button"
            onPress={openSettings}
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons color={colors.accent} name="settings-outline" size={22} />
            <Text style={styles.settingsLabel}>Configuración</Text>
            <Ionicons
              color={colors.textSecondary}
              name="chevron-forward"
              size={20}
            />
          </Pressable>

          <View style={styles.employeeCard}>
            <Text style={styles.employeeKicker}>EMPLEADOS</Text>
            <Text style={styles.employeeHint}>
              Ingresa tu código de empleado
            </Text>
            <View style={styles.employeeCodeContainer}>
              <TextInput
                autoCapitalize="characters"
                keyboardType="number-pad"
                onChangeText={(code) => {
                  setEmployeeCode(code);
                  setCodeError(false);
                }}
                onSubmitEditing={accessEmployeeOrders}
                placeholder="Código de empleado"
                placeholderTextColor={kitchen.muted}
                returnKeyType="done"
                style={styles.employeeCodeInput}
                value={employeeCode}
              />
              <Pressable
                accessibilityLabel="Acceder a los pedidos de empleados"
                accessibilityRole="button"
                onPress={accessEmployeeOrders}
                style={({ pressed }) => [
                  styles.accessButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons color="#ffffff" name="arrow-forward" size={22} />
              </Pressable>
            </View>

            {codeError ? (
              <Text style={styles.errorMessage}>
                Código de empleado inválido
              </Text>
            ) : null}
          </View>

          <Text style={styles.version}>Versión 1.0.0</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeView>
  );
}

function createStyles(colors: Palette, kitchen: typeof employee) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    keyboardAvoider: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    pressed: {
      opacity: 0.72,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: "800",
      marginTop: 2,
    },
    kicker: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.4,
      paddingTop: 8,
    },
    userName: {
      color: colors.textSecondary,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 10,
    },
    cardsRow: {
      flexDirection: "row",
      gap: 18,
      marginTop: 33,
    },
    smallCard: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      elevation: 3,
      flex: 1,
      height: 146,
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingVertical: 12,
      shadowColor: "#302512",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    favoritesCard: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      elevation: 3,
      height: 146,
      justifyContent: "space-between",
      marginTop: 16,
      paddingVertical: 12,
      shadowColor: "#302512",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 18,
      textAlign: "center",
    },
    iconCircle: {
      alignItems: "center",
      backgroundColor: colors.accentSoft,
      borderRadius: 30,
      height: 56,
      justifyContent: "center",
      width: 56,
    },
    cardDescription: {
      color: colors.textSecondary,
      fontSize: 13,
      textAlign: "center",
    },
    settingsButton: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    settingsLabel: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
    },
    employeeCard: {
      backgroundColor: kitchen.background,
      borderRadius: 22,
      marginTop: "auto",
      padding: 16,
    },
    employeeKicker: {
      color: kitchen.accent,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.4,
      textAlign: "center",
    },
    employeeHint: {
      color: kitchen.muted,
      fontSize: 13,
      lineHeight: 18,
      paddingBottom: 10,
      paddingTop: 6,
      textAlign: "center",
    },
    employeeCodeContainer: {
      alignItems: "center",
      backgroundColor: kitchen.surface,
      borderColor: kitchen.border,
      borderRadius: radii.pill,
      borderWidth: 1.3,
      flexDirection: "row",
      marginTop: 0,
      paddingHorizontal: 14,
    },
    employeeCodeInput: {
      color: kitchen.text,
      flex: 1,
      fontSize: 18,
      height: 50,
      marginLeft: 12,
    },
    accessButton: {
      alignItems: "center",
      backgroundColor: colors.accent,
      borderRadius: 7,
      height: 36,
      justifyContent: "center",
      width: 40,
    },
    errorMessage: {
      color: "#c5161d",
      fontSize: 13,
      marginTop: 6,
      textAlign: "center",
    },
    version: {
      color: colors.textSecondary,
      fontSize: 12,
      paddingBottom: 8,
      paddingTop: 8,
      textAlign: "center",
    },
  });
}
