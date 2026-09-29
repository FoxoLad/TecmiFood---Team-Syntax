/**
 * Pantalla de carga premium al entrar a una cafetería.
 * Busters: perrito. Bee Sweet: abeja.
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
import { cafeteriaOptionColors } from "../constants/theme";
import { useColors, useThemeStore } from "../stores/useTheme";

const HOLD_MS = 1800;
const FADE_MS = 420;
const USE_NATIVE = Platform.OS !== "web";

export type CafeteriaSplashVariant = "busters" | "beesweet";

type CafeteriaSplashProps = {
  variant: CafeteriaSplashVariant;
};

const THEME = {
  busters: {
    brand: "Busters",
    caption: "Preparando tu café",
    softLight: "#E9DDBD",
    softDark: "#3A2E22",
  },
  beesweet: {
    brand: "Bee Sweet",
    caption: "Endulzando tu visita",
    softLight: "#F5E8C0",
    softDark: "#3A3420",
  },
} as const;

export function CafeteriaSplash({ variant }: CafeteriaSplashProps) {
  const colors = useColors();
  const mode = useThemeStore((state) => state.mode);
  const [visible, setVisible] = useState(true);
  const [opacity] = useState(() => new Animated.Value(1));
  const [float] = useState(() => new Animated.Value(0));
  const [spin] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const [load] = useState(() => new Animated.Value(0));

  const isBusters = variant === "busters";
  const meta = THEME[variant];
  const tone = cafeteriaOptionColors[mode];
  const accent = isBusters ? tone.bustersHeader : tone.beeSweetHeader;
  const accentSoft = mode === "dark" ? meta.softDark : meta.softLight;
  const ringDot = isBusters ? accent : tone.beeSweetCard;

  useEffect(() => {
    let cancelled = false;
    const loops: Animated.CompositeAnimation[] = [];
    let fadeAnim: Animated.CompositeAnimation | null = null;

    const stopAll = () => {
      loops.forEach((loop) => loop.stop());
      fadeAnim?.stop();
      opacity.stopAnimation();
      float.stopAnimation();
      spin.stopAnimation();
      pulse.stopAnimation();
      load.stopAnimation();
    };

    const startMotion = () => {
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(float, {
            toValue: 1,
            duration: 880,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(float, {
            toValue: 0,
            duration: 880,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: USE_NATIVE,
          }),
        ]),
      );
      const spinLoop = Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: USE_NATIVE,
        }),
        { resetBeforeIteration: true },
      );
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: USE_NATIVE,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: USE_NATIVE,
          }),
        ]),
      );
      loops.push(floatLoop, spinLoop, pulseLoop);
      floatLoop.start();
      spinLoop.start();
      pulseLoop.start();
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

    Animated.timing(load, {
      toValue: 1,
      duration: HOLD_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE,
    }).start();

    const timer = setTimeout(() => {
      fadeAnim = Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      });
      fadeAnim.start(({ finished }) => {
        if (finished && !cancelled) {
          stopAll();
          setVisible(false);
        }
      });
    }, HOLD_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      stopAll();
    };
  }, [float, load, opacity, pulse, spin]);

  if (!visible) {
    return null;
  }

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [8, -12],
  });
  const tilt = float.interpolate({
    inputRange: [0, 1],
    outputRange: isBusters ? ["-18deg", "-8deg"] : ["-12deg", "12deg"],
  });
  const ringRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });
  const progressX = load.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 0],
  });

  return (
    <Animated.View
      accessibilityLabel={`Cargando ${meta.brand}`}
      accessibilityRole="progressbar"
      pointerEvents="auto"
      style={[styles.overlay, { backgroundColor: colors.background, opacity }]}
    >
      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: accentSoft,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            { borderColor: accentSoft, transform: [{ rotate: ringRotate }] },
          ]}
        >
          <View style={[styles.ringDot, styles.ringDotTop, { backgroundColor: ringDot }]} />
          <View style={[styles.ringDot, styles.ringDotBottom, { backgroundColor: ringDot }]} />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY }, { rotate: tilt }] }}>
          {isBusters ? <BustersMark accent={accent} /> : <BeeSweetMark />}
        </Animated.View>
      </View>

      <Text style={[styles.brand, { color: colors.text }]}>{meta.brand}</Text>
      <Text style={[styles.caption, { color: colors.textSecondary }]}>
        {meta.caption}
      </Text>
      <View style={[styles.progressTrack, { backgroundColor: accentSoft }]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: accent, transform: [{ translateX: progressX }] },
          ]}
        />
      </View>
    </Animated.View>
  );
}

function BustersMark({ accent }: { accent: string }) {
  return (
    <View style={styles.dogScene}>
      <View style={styles.dogTail} />
      <View style={styles.dogBody}>
        <View style={styles.dogBelly} />
        <View style={[styles.dogSpot, { backgroundColor: accent }]} />
      </View>
      <View style={styles.dogLegBack} />
      <View style={styles.dogLegFront} />
      <View style={styles.dogHead}>
        <View style={styles.dogEarLeft} />
        <View style={styles.dogEarRight} />
        <View style={styles.dogSnout}>
          <View style={styles.dogNose} />
          <View style={styles.dogMouth} />
        </View>
        <View style={styles.dogEyeLeft}>
          <View style={styles.dogPupil} />
          <View style={styles.dogEyeShine} />
        </View>
        <View style={styles.dogEyeRight}>
          <View style={styles.dogPupil} />
          <View style={styles.dogEyeShine} />
        </View>
        <View style={styles.dogCheek} />
      </View>
      <View style={[styles.dogCollar, { backgroundColor: accent }]}>
        <View style={styles.dogTag} />
      </View>
    </View>
  );
}

function BeeSweetMark() {
  return (
    <View style={styles.beeScene}>
      {/* alas */}
      <View style={styles.beeWingLeft}>
        <View style={styles.beeWingVein} />
      </View>
      <View style={styles.beeWingRight}>
        <View style={styles.beeWingVein} />
      </View>
      {/* abdomen */}
      <View style={styles.beeAbdomen}>
        <View style={styles.beeStripe} />
        <View style={[styles.beeStripe, styles.beeStripe2]} />
        <View style={[styles.beeStripe, styles.beeStripe3]} />
        <View style={styles.beeStinger} />
      </View>
      {/* tórax */}
      <View style={styles.beeThorax} />
      {/* patitas */}
      <View style={styles.beeLegL1} />
      <View style={styles.beeLegL2} />
      <View style={styles.beeLegR1} />
      <View style={styles.beeLegR2} />
      {/* cabeza */}
      <View style={styles.beeHead}>
        <View style={styles.beeAntennaL}>
          <View style={styles.beeAntennaTip} />
        </View>
        <View style={styles.beeAntennaR}>
          <View style={styles.beeAntennaTip} />
        </View>
        <View style={styles.beeEyeL}>
          <View style={styles.beeEyeShine} />
        </View>
        <View style={styles.beeEyeR}>
          <View style={styles.beeEyeShine} />
        </View>
        <View style={styles.beeSmile} />
        <View style={styles.beeCheekL} />
        <View style={styles.beeCheekR} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 40,
  },
  stage: {
    alignItems: "center",
    height: 190,
    justifyContent: "center",
    width: 190,
  },
  glow: {
    borderRadius: 90,
    height: 150,
    position: "absolute",
    width: 150,
  },
  ring: {
    borderRadius: 82,
    borderWidth: 1.5,
    height: 164,
    left: 13,
    position: "absolute",
    top: 13,
    width: 164,
  },
  ringDot: {
    borderRadius: 5,
    height: 10,
    left: 77,
    position: "absolute",
    width: 10,
  },
  ringDotTop: {
    top: -5,
  },
  ringDotBottom: {
    bottom: -5,
  },
  brand: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 22,
  },
  caption: {
    fontSize: 14,
    letterSpacing: 0.7,
    marginTop: 6,
  },
  progressTrack: {
    borderRadius: 4,
    height: 4,
    marginTop: 22,
    overflow: "hidden",
    width: 120,
  },
  progressFill: {
    borderRadius: 4,
    height: 4,
    width: 120,
  },

  // —— Perrito Busters ——
  dogScene: {
    height: 118,
    width: 110,
  },
  dogTail: {
    backgroundColor: "#A86B3A",
    borderRadius: 8,
    height: 14,
    left: 4,
    position: "absolute",
    top: 52,
    transform: [{ rotate: "-38deg" }],
    width: 28,
  },
  dogEarLeft: {
    backgroundColor: "#8B5530",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 34,
    left: -6,
    position: "absolute",
    top: 4,
    transform: [{ rotate: "-18deg" }],
    width: 20,
    zIndex: 1,
  },
  dogEarRight: {
    backgroundColor: "#8B5530",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 34,
    position: "absolute",
    right: -6,
    top: 4,
    transform: [{ rotate: "18deg" }],
    width: 20,
    zIndex: 1,
  },
  dogBody: {
    backgroundColor: "#D4A06A",
    borderRadius: 28,
    bottom: 18,
    elevation: 6,
    height: 52,
    left: 22,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#3C2415",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    width: 64,
  },
  dogBelly: {
    backgroundColor: "#F0D5B0",
    borderRadius: 16,
    bottom: 6,
    height: 28,
    left: 14,
    position: "absolute",
    width: 36,
  },
  dogSpot: {
    borderRadius: 8,
    height: 14,
    opacity: 0.55,
    position: "absolute",
    right: 10,
    top: 10,
    width: 18,
  },
  dogLegBack: {
    backgroundColor: "#C4894F",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    bottom: 4,
    height: 22,
    left: 28,
    position: "absolute",
    width: 16,
  },
  dogLegFront: {
    backgroundColor: "#D09A62",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    bottom: 4,
    height: 24,
    left: 56,
    position: "absolute",
    width: 16,
  },
  dogHead: {
    backgroundColor: "#E0B07A",
    borderRadius: 30,
    elevation: 8,
    height: 58,
    left: 30,
    position: "absolute",
    shadowColor: "#3C2415",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    top: 6,
    width: 58,
  },
  dogSnout: {
    alignItems: "center",
    backgroundColor: "#F3D9B8",
    borderRadius: 14,
    bottom: 8,
    height: 22,
    left: 16,
    position: "absolute",
    width: 28,
  },
  dogNose: {
    backgroundColor: "#2A2118",
    borderRadius: 5,
    height: 9,
    marginTop: 2,
    width: 12,
  },
  dogMouth: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderColor: "#C4894F",
    borderTopWidth: 0,
    borderWidth: 1.5,
    height: 6,
    marginTop: 1,
    width: 10,
  },
  dogEyeLeft: {
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    borderRadius: 7,
    height: 14,
    justifyContent: "center",
    left: 12,
    position: "absolute",
    top: 20,
    width: 14,
  },
  dogEyeRight: {
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    borderRadius: 7,
    height: 14,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 20,
    width: 14,
  },
  dogPupil: {
    backgroundColor: "#2A2118",
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  dogEyeShine: {
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    height: 3,
    left: 3,
    position: "absolute",
    top: 2,
    width: 3,
  },
  dogCheek: {
    backgroundColor: "rgba(232, 140, 100, 0.35)",
    borderRadius: 6,
    bottom: 18,
    height: 10,
    position: "absolute",
    right: 6,
    width: 12,
  },
  dogCollar: {
    borderRadius: 4,
    height: 8,
    left: 40,
    position: "absolute",
    top: 58,
    width: 38,
  },
  dogTag: {
    backgroundColor: "#E2B15A",
    borderRadius: 5,
    bottom: -6,
    height: 10,
    left: 14,
    position: "absolute",
    width: 10,
  },

  // —— Abeja Bee Sweet ——
  beeScene: {
    height: 118,
    width: 120,
  },
  beeWingLeft: {
    backgroundColor: "rgba(255, 252, 235, 0.88)",
    borderColor: "#E8D9A8",
    borderRadius: 28,
    borderWidth: 1.5,
    height: 42,
    left: 2,
    position: "absolute",
    top: 28,
    transform: [{ rotate: "-32deg" }],
    width: 46,
  },
  beeWingRight: {
    backgroundColor: "rgba(255, 252, 235, 0.88)",
    borderColor: "#E8D9A8",
    borderRadius: 28,
    borderWidth: 1.5,
    height: 42,
    position: "absolute",
    right: 2,
    top: 28,
    transform: [{ rotate: "32deg" }],
    width: 46,
  },
  beeWingVein: {
    backgroundColor: "rgba(200, 180, 120, 0.35)",
    borderRadius: 1,
    height: 22,
    left: 20,
    position: "absolute",
    top: 10,
    transform: [{ rotate: "12deg" }],
    width: 2,
  },
  beeAbdomen: {
    alignItems: "center",
    backgroundColor: "#F5C542",
    borderRadius: 26,
    bottom: 10,
    elevation: 6,
    height: 54,
    left: 34,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#8A6A20",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    width: 52,
  },
  beeStripe: {
    backgroundColor: "#2A2118",
    height: 7,
    left: 0,
    position: "absolute",
    right: 0,
    top: 10,
  },
  beeStripe2: { top: 22 },
  beeStripe3: { top: 34 },
  beeStinger: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    bottom: 2,
    height: 8,
    position: "absolute",
    width: 6,
  },
  beeThorax: {
    backgroundColor: "#F7D25A",
    borderRadius: 16,
    elevation: 4,
    height: 28,
    left: 42,
    position: "absolute",
    shadowColor: "#8A6A20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    top: 42,
    width: 36,
  },
  beeLegL1: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 12,
    left: 38,
    position: "absolute",
    top: 62,
    transform: [{ rotate: "28deg" }],
    width: 3,
  },
  beeLegL2: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 12,
    left: 46,
    position: "absolute",
    top: 66,
    transform: [{ rotate: "12deg" }],
    width: 3,
  },
  beeLegR1: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 12,
    position: "absolute",
    right: 38,
    top: 62,
    transform: [{ rotate: "-28deg" }],
    width: 3,
  },
  beeLegR2: {
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 12,
    position: "absolute",
    right: 46,
    top: 66,
    transform: [{ rotate: "-12deg" }],
    width: 3,
  },
  beeHead: {
    alignItems: "center",
    backgroundColor: "#FFE066",
    borderRadius: 26,
    elevation: 8,
    height: 48,
    left: 36,
    position: "absolute",
    shadowColor: "#8A6A20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    top: 6,
    width: 48,
  },
  beeAntennaL: {
    alignItems: "center",
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 16,
    left: 10,
    position: "absolute",
    top: -12,
    transform: [{ rotate: "-28deg" }],
    width: 3,
  },
  beeAntennaR: {
    alignItems: "center",
    backgroundColor: "#2A2118",
    borderRadius: 2,
    height: 16,
    position: "absolute",
    right: 10,
    top: -12,
    transform: [{ rotate: "28deg" }],
    width: 3,
  },
  beeAntennaTip: {
    backgroundColor: "#2A2118",
    borderRadius: 4,
    height: 8,
    left: -2.5,
    position: "absolute",
    top: -5,
    width: 8,
  },
  beeEyeL: {
    alignItems: "center",
    backgroundColor: "#2A2118",
    borderRadius: 8,
    height: 14,
    justifyContent: "center",
    left: 8,
    position: "absolute",
    top: 16,
    width: 14,
  },
  beeEyeR: {
    alignItems: "center",
    backgroundColor: "#2A2118",
    borderRadius: 8,
    height: 14,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 16,
    width: 14,
  },
  beeEyeShine: {
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    height: 5,
    left: 2,
    position: "absolute",
    top: 2,
    width: 5,
  },
  beeSmile: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: "#2A2118",
    borderTopWidth: 0,
    borderWidth: 2,
    bottom: 8,
    height: 8,
    position: "absolute",
    width: 14,
  },
  beeCheekL: {
    backgroundColor: "rgba(232, 140, 100, 0.4)",
    borderRadius: 5,
    bottom: 14,
    height: 8,
    left: 4,
    position: "absolute",
    width: 8,
  },
  beeCheekR: {
    backgroundColor: "rgba(232, 140, 100, 0.4)",
    borderRadius: 5,
    bottom: 14,
    height: 8,
    position: "absolute",
    right: 4,
    width: 8,
  },
});
