/** Círculo que nace en el centro y cubre la app antes de aplicar el tema. */
import { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { darkColors, lightColors } from "../constants/theme";
import { useThemeStore } from "../stores/useTheme";

export function ThemeReveal() {
  const phase = useThemeStore((state) => state.phase);
  const target = useThemeStore((state) => state.target);
  const completeTransition = useThemeStore((state) => state.completeTransition);
  const { width, height } = useWindowDimensions();
  const [scale] = useState(() => new Animated.Value(0));
  const size = Math.hypot(width, height) * 2;

  useEffect(() => {
    if (phase !== "expanding" || !target) {
      return;
    }
    scale.setValue(0);
    const animation = Animated.timing(scale, {
      toValue: 1,
      duration: 720,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start(({ finished }) => {
      if (finished) {
        completeTransition();
      }
    });
    return () => animation.stop();
  }, [completeTransition, phase, scale, target]);

  if (phase !== "expanding" || !target) {
    return null;
  }

  return (
    <View pointerEvents="auto" style={styles.overlay}>
      <Animated.View
        style={{
          backgroundColor: target === "dark" ? darkColors.background : lightColors.background,
          borderRadius: size / 2,
          height: size,
          left: (width - size) / 2,
          position: "absolute",
          top: (height - size) / 2,
          transform: [{ scale }],
          width: size,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 40,
  },
});
