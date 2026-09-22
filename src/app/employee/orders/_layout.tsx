import { Stack } from "expo-router";
import { colors } from "../../../constants/theme";

export default function EmployeeOrdersLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    />
  );
}
