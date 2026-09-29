/**
 * Animación de entrada. Un grano de café flota unos segundos y la pantalla se desvanece.
 */
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../constants/theme";

const HOLD_MS = 2200;
const FADE_MS = 480;
const useNativeDriver = Platform.OS !== "web";

export function CoffeeSplash() {
  const [visible, setVisible] = useState(true);
  const [opacity] = useState(() => new Animated.Value(1));
  const [float] = useState(() => new Animated.Value(0));
  const [spin] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let cancelled = false;
    const loops: Animated.CompositeAnimation[] = [];

    const startMotion = () => {
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(float, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver,
          }),
          Animated.timing(float, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver,
          }),
        ]),
      );
      const spinLoop = Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver,
        }),
      );
      loops.push(floatLoop, spinLoop);
      floatLoop.start();
      spinLoop.start();
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduceMotion) => {
        if (!cancelled && !reduceMotion) {
          startMotion();
        }
      })
      .catch(() => {
        if (!cancelled) {
          startMotion();
        }
      });

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }).start(({ finished }) => {
        if (finished) {
          setVisible(false);
        }
      });
    }, HOLD_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      loops.forEach((loop) => loop.stop());
      opacity.stopAnimation();
    };
  }, [float, opacity, spin]);

  if (!visible) {
    return null;
  }

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [6, -10],
  });
  const tilt = float.interpolate({
    inputRange: [0, 1],
    outputRange: ["-22deg", "-12deg"],
  });
  const ringRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      accessibilityLabel="Cargando TecmiFood"
      accessibilityRole="progressbar"
      style={[styles.overlay, { opacity }]}
    >
      <View style={styles.stage}>
        <Animated.View style={[styles.ring, { transform: [{ rotate: ringRotate }] }]}>
          <View style={styles.ringDot} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY }, { rotate: tilt }] }}>
          <View style={styles.bean}>
            <View style={styles.highlight} />
            <View style={styles.crease} />
          </View>
        </Animated.View>
      </View>
      <Text style={styles.brand}>TecmiFood</Text>
      <Text style={styles.caption}>Preparando tu experiencia</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: colors.background,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 30,
  },
  stage: {
    alignItems: "center",
    height: 168,
    justifyContent: "center",
    width: 168,
  },
  ring: {
    borderColor: colors.accentSoft,
    borderRadius: 74,
    borderWidth: 1.5,
    height: 148,
    left: 10,
    position: "absolute",
    top: 10,
    width: 148,
  },
  ringDot: {
    backgroundColor: colors.accent,
    borderRadius: 5,
    height: 10,
    left: 69,
    position: "absolute",
    top: -5,
    width: 10,
  },
  bean: {
    alignItems: "center",
    backgroundColor: "#6B4423",
    borderColor: "#8A5A32",
    borderRadius: 42,
    borderWidth: 1,
    elevation: 8,
    height: 108,
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#3C2415",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    width: 74,
  },
  highlight: {
    backgroundColor: "rgba(255, 236, 210, 0.28)",
    borderRadius: 16,
    height: 46,
    left: 12,
    position: "absolute",
    top: 16,
    transform: [{ rotate: "-18deg" }],
    width: 18,
  },
  crease: {
    backgroundColor: "#3B2416",
    borderRadius: 4,
    height: 82,
    transform: [{ rotate: "8deg" }],
    width: 5,
  },
  brand: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginTop: 28,
  },
  caption: {
    color: colors.textSecondary,
    fontSize: 14,
    letterSpacing: 0.6,
    marginTop: 6,
  },
});
