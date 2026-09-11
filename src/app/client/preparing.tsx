import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SafeView from "../../components/SafeView";
import { colors, radii, spacing } from "../../constants/theme";

export default function PreparingOrderScreen() {
  return (
    <SafeView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons color={colors.accent} name="restaurant-outline" size={52} />
        </View>
        <Text style={styles.title}>Tu producto se está preparando</Text>
        <Text style={styles.message}>
          Recibimos tu pedido. Te avisaremos cuando esté listo.
        </Text>
        <Pressable
          accessibilityLabel="Volver al inicio"
          accessibilityRole="button"
          onPress={() => router.replace("/client/(client-tabs)/home")}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </SafeView>
  );
}

const styles = StyleSheet.create({
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
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 310,
    textAlign: "center",
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
});