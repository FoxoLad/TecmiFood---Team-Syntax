/** Safe area con bordes completos para que el contenido no quede bajo la barra del sistema. */
import {
    SafeAreaView as ContextSafeAreaView,
    type SafeAreaViewProps,
} from "react-native-safe-area-context";

// Evita que el contenido quede debajo de la barra de estado o de la barra de gestos del teléfono.
export default function SafeView({ edges = ["top", "right", "bottom", "left"], ...props }: SafeAreaViewProps) {
  return <ContextSafeAreaView edges={edges} {...props} />;
}