/**
 * Mascota de la búsqueda de Bee Sweet.
 * Cada tecla dispara un gesto corto: la abeja zumba y las alas aletean.
 */
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from "react-native";

const USE_NATIVE = Platform.OS !== "web";

type BeeSearchMascotProps = {
  query: string;
};

// Abeja de la búsqueda de Bee Sweet. Cada letra que se escribe hace que aletee.
export function BeeSearchMascot({ query }: BeeSearchMascotProps) {
  const [progress] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    progress.setValue(0);
    const gesture = Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      }),
      Animated.timing(progress, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: USE_NATIVE,
      }),
    ]);
    gesture.start();

    return () => {
      gesture.stop();
      progress.stopAnimation();
    };
  }, [progress, query, reduceMotion]);

  const hop = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const sway = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["-6deg", "10deg"],
  });
  const wingLeft = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["-18deg", "28deg"],
  });
  const wingRight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["18deg", "-28deg"],
  });
  const dropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const dropRise = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.scene}
    >
      <Animated.View
        style={[styles.bee, { transform: [{ translateY: hop }, { rotate: sway }] }]}
      >
        <Animated.View style={[styles.wingLeft, { transform: [{ rotate: wingLeft }] }]} />
        <Animated.View style={[styles.wingRight, { transform: [{ rotate: wingRight }] }]} />
        <View style={styles.body}>
          <View style={styles.stripe} />
          <View style={[styles.stripe, styles.stripeMid]} />
        </View>
        <View style={styles.head}>
          <View style={styles.eye} />
          <View style={styles.antenna} />
        </View>
        <View style={styles.stinger} />
      </Animated.View>

      <Animated.View
        style={[
          styles.honeyDrop,
          { opacity: dropOpacity, transform: [{ translateY: dropRise }] },
        ]}
      />
      <View style={styles.jar}>
        <View style={styles.honey} />
        <View style={styles.jarLid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    height: 36,
    marginLeft: 4,
    width: 58,
  },
  bee: {
    bottom: 4,
    height: 28,
    left: 0,
    position: "absolute",
    width: 34,
  },
  wingLeft: {
    backgroundColor: "rgba(255, 248, 220, 0.85)",
    borderColor: "#E8D9A8",
    borderRadius: 8,
    borderWidth: 1,
    height: 10,
    left: 10,
    position: "absolute",
    top: 4,
    width: 12,
  },
  wingRight: {
    backgroundColor: "rgba(255, 248, 220, 0.85)",
    borderColor: "#E8D9A8",
    borderRadius: 8,
    borderWidth: 1,
    height: 10,
    left: 18,
    position: "absolute",
    top: 4,
    width: 12,
  },
  body: {
    backgroundColor: "#F5C542",
    borderRadius: 7,
    bottom: 4,
    height: 12,
    left: 8,
    overflow: "hidden",
    position: "absolute",
    width: 16,
  },
  stripe: {
    backgroundColor: "#2A2118",
    height: 2.5,
    left: 0,
    position: "absolute",
    right: 0,
    top: 3,
  },
  stripeMid: {
    top: 7,
  },
  head: {
    backgroundColor: "#F7D25A",
    borderRadius: 7,
    bottom: 6,
    height: 12,
    left: 20,
    position: "absolute",
    width: 12,
  },
  eye: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 2.5,
    position: "absolute",
    right: 2,
    top: 4,
    width: 2.5,
  },
  antenna: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 5,
    position: "absolute",
    right: 3,
    top: -3,
    transform: [{ rotate: "18deg" }],
    width: 1.5,
  },
  stinger: {
    backgroundColor: "#2A2118",
    borderRadius: 1,
    bottom: 7,
    height: 3,
    left: 4,
    position: "absolute",
    transform: [{ rotate: "-12deg" }],
    width: 5,
  },
  honeyDrop: {
    backgroundColor: "#E2A820",
    borderRadius: 3,
    height: 7,
    position: "absolute",
    right: 7,
    top: 2,
    width: 4,
  },
  jar: {
    backgroundColor: "rgba(255, 253, 245, 0.95)",
    borderColor: "#E8D5A0",
    borderRadius: 3,
    borderWidth: 1.5,
    bottom: 2,
    height: 14,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "absolute",
    right: 2,
    width: 12,
  },
  honey: {
    backgroundColor: "#E2A820",
    height: 7,
  },
  jarLid: {
    backgroundColor: "#C4892F",
    height: 3,
    left: -1,
    position: "absolute",
    right: -1,
    top: 0,
  },
});
