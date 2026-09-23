/**
 * Mascota de la búsqueda de Busters.
 * Cada tecla dispara un gesto corto: el perrito salta y la taza suelta vapor.
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
import { colors } from "../constants/theme";

const useNativeDriver = Platform.OS !== "web";

type SearchMascotProps = {
  query: string;
};

export function SearchMascot({ query }: SearchMascotProps) {
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
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(progress, {
        toValue: 0,
        duration: 320,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver,
      }),
    ]);
    gesture.start();

    return () => {
      gesture.stop();
    };
  }, [progress, query, reduceMotion]);

  const hop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });
  const wag = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["-12deg", "24deg"],
  });
  const tilt = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-8deg"],
  });
  const steamOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 1],
  });
  const steamRise = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.scene}
    >
      <Animated.View style={[styles.dog, { transform: [{ translateY: hop }] }]}>
        <Animated.View style={[styles.tail, { transform: [{ rotate: wag }] }]} />
        <View style={styles.body} />
        <View style={styles.head}>
          <View style={styles.ear} />
          <View style={styles.eye} />
          <View style={styles.nose} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.cupWrap, { transform: [{ rotate: tilt }] }]}>
        <Animated.View
          style={[
            styles.steam,
            { opacity: steamOpacity, transform: [{ translateY: steamRise }] },
          ]}
        />
        <View style={styles.cup}>
          <View style={styles.coffee} />
        </View>
        <View style={styles.handle} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    height: 36,
    marginLeft: 4,
    width: 58,
  },
  dog: {
    bottom: 2,
    height: 28,
    left: 0,
    position: "absolute",
    width: 34,
  },
  tail: {
    backgroundColor: "#8C5A32",
    borderRadius: 3,
    bottom: 10,
    height: 4,
    left: 1,
    position: "absolute",
    width: 9,
  },
  body: {
    backgroundColor: "#C4894F",
    borderRadius: 8,
    bottom: 2,
    height: 12,
    left: 8,
    position: "absolute",
    width: 18,
  },
  head: {
    backgroundColor: "#D09A62",
    borderRadius: 8,
    bottom: 8,
    height: 16,
    left: 15,
    position: "absolute",
    width: 16,
  },
  ear: {
    backgroundColor: "#8C5A32",
    borderRadius: 4,
    height: 8,
    left: 1,
    position: "absolute",
    top: -3,
    transform: [{ rotate: "-16deg" }],
    width: 6,
  },
  eye: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 2.5,
    position: "absolute",
    right: 3,
    top: 6,
    width: 2.5,
  },
  nose: {
    backgroundColor: "#3B2416",
    borderRadius: 2,
    bottom: 3,
    height: 3,
    position: "absolute",
    right: 1,
    width: 4,
  },
  cupWrap: {
    bottom: 2,
    height: 30,
    position: "absolute",
    right: 0,
    width: 18,
  },
  steam: {
    backgroundColor: "#C9B8A2",
    borderRadius: 2,
    height: 8,
    left: 6,
    position: "absolute",
    top: 1,
    width: 2,
  },
  cup: {
    backgroundColor: "#FFFDF9",
    borderColor: "#E4D5C3",
    borderRadius: 3,
    borderWidth: 1.5,
    bottom: 0,
    height: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "absolute",
    width: 14,
  },
  coffee: {
    backgroundColor: colors.accent,
    height: 6,
  },
  handle: {
    borderColor: "#E4D5C3",
    borderRadius: 4,
    borderWidth: 1.5,
    bottom: 3,
    height: 7,
    position: "absolute",
    right: 0,
    width: 6,
  },
});
