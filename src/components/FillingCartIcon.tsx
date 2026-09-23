/** Carrito que se llena de productos y vuelve a empezar, en bucle. */
import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, View } from "react-native";

const useNativeDriver = Platform.OS !== "web";

type FillingCartIconProps = {
  size?: number;
  color: string;
  fill: string;
};

export function FillingCartIcon({ size = 88, color, fill }: FillingCartIconProps) {
  const [progress] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);
  const basketWidth = size * 0.78;
  const basketHeight = size * 0.46;
  const itemSize = Math.max(6, size * 0.12);
  const stroke = Math.max(2, size * 0.034);

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
      progress.setValue(0.8);
      return;
    }
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reduceMotion]);

  const level = progress.interpolate({
    inputRange: [0, 0.72, 0.88, 1],
    outputRange: [basketHeight, 4, 4, basketHeight],
  });

  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={[styles.stage, { height: size, width: size }]}>
      <View
        style={[
          styles.handle,
          {
            borderColor: color,
            borderLeftWidth: stroke,
            borderRightWidth: stroke,
            borderTopWidth: stroke,
            height: size * 0.22,
            width: size * 0.34,
          },
        ]}
      />
      <View
        style={[
          styles.basket,
          {
            borderColor: color,
            borderWidth: stroke,
            height: basketHeight,
            width: basketWidth,
          },
        ]}
      >
        <Animated.View style={[styles.level, { backgroundColor: fill, height: basketHeight, transform: [{ translateY: level }] }]} />
        <DroppingItem color={color} delay={0.12} progress={progress} size={itemSize} />
        <DroppingItem color="#C47A4A" delay={0.34} progress={progress} size={itemSize} />
        <DroppingItem color="#F4E2B5" delay={0.56} progress={progress} size={itemSize} />
      </View>
      <View style={styles.wheels}>
        <View style={[styles.wheel, { backgroundColor: color }]} />
        <View style={[styles.wheel, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function DroppingItem({
  progress,
  delay,
  color,
  size,
}: {
  progress: Animated.Value;
  delay: number;
  color: string;
  size: number;
}) {
  const opacity = progress.interpolate({
    inputRange: [0, delay, delay + 0.12, 0.9, 1],
    outputRange: [0, 0, 1, 1, 0],
  });
  const translateY = progress.interpolate({
    inputRange: [delay, delay + 0.14, 0.9, 1],
    outputRange: [-22, 0, 0, 10],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.item,
        { backgroundColor: color, height: size, opacity, transform: [{ translateY }], width: size },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  handle: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginBottom: -2,
  },
  basket: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  level: {
    borderRadius: 4,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  item: {
    borderRadius: 3,
    zIndex: 1,
  },
  wheels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    width: "62%",
  },
  wheel: {
    borderRadius: 5,
    height: 8,
    width: 8,
  },
});
