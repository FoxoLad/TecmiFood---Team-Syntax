/** Safe area con bordes completos para que el contenido no quede bajo la barra del sistema. */
import {
    SafeAreaView as ContextSafeAreaView,
    type SafeAreaViewProps,
} from "react-native-safe-area-context";

export default function SafeView({ edges = ["top", "right", "bottom", "left"], ...props }: SafeAreaViewProps) {
  return <ContextSafeAreaView edges={edges} {...props} />;
}