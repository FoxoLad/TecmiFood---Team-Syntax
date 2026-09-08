import {
    SafeAreaView as ContextSafeAreaView,
    type SafeAreaViewProps,
} from "react-native-safe-area-context";

export default function SafeView({ edges = ["top", "right", "bottom", "left"], ...props }: SafeAreaViewProps) {
  return <ContextSafeAreaView edges={edges} {...props} />;
}