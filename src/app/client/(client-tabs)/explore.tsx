/** Pestaña oculta. Se conserva para no romper la ruta explore. */
import { View } from "react-native";
import { useColors } from "../../../stores/useTheme";

export default function ExploreScreen() {
  const colors = useColors();
  return <View style={{ backgroundColor: colors.background, flex: 1 }} />;
}