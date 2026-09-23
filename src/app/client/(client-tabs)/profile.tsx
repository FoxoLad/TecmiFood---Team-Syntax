import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
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
import { colors, radii } from "../../../constants/theme";

import { useUserStore } from "../../../stores/useUserStore";

// NOTE: this value ships inside the app bundle, so it is only a soft gate.
// Real protection needs the code to be validated by the backend.
const EMPLOYEE_CODE = "12345";

export default function ProfileScreen() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const router = useRouter();
  const clientId = useUserStore((state) => state.clientId);

  // Cast to Href so these compile even if .expo/types/router.d.ts is stale.
  // Once the route types regenerate you can drop the casts.
  const openActiveOrders = () => router.push("/client/orders?view=active" as Href);

  const openOrderHistory = () => router.push("/client/orders?view=history" as Href);

  const openFavorites = () => router.push("/client/favorites");

  const accessEmployeeOrders = () => {
    if (employeeCode.trim() === EMPLOYEE_CODE) {
      setCodeError(false);
      // Clear the field: this tab stays mounted, so the code would otherwise
      // still be sitting in the input when the employee returns to the client view.
      setEmployeeCode("");
      Keyboard.dismiss();
      router.push("/employee/orders");
      return;
    }

    setCodeError(true);
  };

  return (
    <SafeView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoider}
      >
        <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.container}>
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
              style={({ pressed }) => [styles.smallCard, pressed && styles.pressed]}
            >
              <Text style={styles.cardTitle}>Pedidos Activos</Text>
              <View style={styles.iconCircle}>
                <Ionicons color={colors.accent} name="cart-outline" size={32} />
              </View>
              <Text style={styles.cardDescription}>Sigue el estado de tus pedidos</Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Ver historial de pedidos"
              accessibilityRole="button"
              onPress={openOrderHistory}
              style={({ pressed }) => [styles.smallCard, pressed && styles.pressed]}
            >
              <Text style={styles.cardTitle}>Historial</Text>
              <View style={styles.iconCircle}>
                <Ionicons color={colors.accent} name="time-outline" size={32} />
              </View>
              <Text style={styles.cardDescription}>Ver detalles de tus pedidos anteriores</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityLabel="Ver mis favoritos"
            accessibilityRole="button"
            onPress={openFavorites}
            style={({ pressed }) => [styles.favoritesCard, pressed && styles.pressed]}
          >
            <Text style={styles.cardTitle}>Mis Favoritos</Text>
            <View style={styles.iconCircle}>
              <Ionicons color="#ef1d25" name="heart-outline" size={42} />
            </View>
            <Text style={styles.cardDescription}>Tus productos guardados</Text>
          </Pressable>

          <Text style={styles.employeeHint}>¿Eres de la cafetería? Ingresa tu código para ver y aceptar pedidos.</Text>
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
              placeholderTextColor="#333333"
              returnKeyType="done"
              style={styles.employeeCodeInput}
              value={employeeCode}
            />
            <Pressable
              accessibilityLabel="Acceder a los pedidos de empleados"
              accessibilityRole="button"
              onPress={accessEmployeeOrders}
              style={({ pressed }) => [styles.accessButton, pressed && styles.pressed]}
            >
              <Ionicons color="#ffffff" name="arrow-forward" size={22} />
            </Pressable>
          </View>

          {codeError ? <Text style={styles.errorMessage}>Código de empleado inválido</Text> : null}

          <Text style={styles.version}>Versión 1.0.0</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
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
    borderColor: "#E7E2D8",
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
    borderColor: "#E7E2D8",
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
    fontSize: 13,
    textAlign: "center",
  },
  employeeHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: "auto",
    paddingBottom: 8,
    textAlign: "center",
  },
  employeeCodeContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1.3,
    flexDirection: "row",
    marginTop: 0,
    paddingHorizontal: 14,
  },
  employeeCodeInput: {
    flex: 1,
    fontSize: 18,
    height: 50,
    marginLeft: 12,
  },
  accessButton: {
    alignItems: "center",
    backgroundColor: "#000000",
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
    color: "#666666",
    fontSize: 12,
    paddingBottom: 8,
    paddingTop: 8,
    textAlign: "center",
  },
});