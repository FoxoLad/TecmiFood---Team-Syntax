/** Navegación del empleado: órdenes activas y resumen de ventas. */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { employee } from "../../constants/theme";

export default function EmployeeLayout() {
  return (
    <>
      <StatusBar animated style="dark" />
      <Stack
        screenOptions={{
          animation: Platform.OS === "ios" ? "slide_from_right" : "fade_from_bottom",
          contentStyle: { backgroundColor: employee.background },
          headerShown: false,
        }}
      >
      <Stack.Screen name="index" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="history" />
      </Stack>
    </>
  );
}
