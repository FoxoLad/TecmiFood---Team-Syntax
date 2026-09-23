/** Navegación del empleado: órdenes activas y resumen de ventas. */
import { Stack } from "expo-router";
import { colors } from "../../constants/theme";

export default function EmployeeLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        animationDuration: 250,
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
