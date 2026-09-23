/** Aviso visible para el cliente: círculo verde si está abierta y rojo si está cerrada. */
import { StyleSheet, Text, View } from "react-native";
import { colors, radii } from "../constants/theme";
import { useCafeteriaStatus } from "../stores/useCafeteriaStatus";

type CafeteriaStatusBannerProps = {
  contained?: boolean;
};

export function CafeteriaStatusBanner({ contained = false }: CafeteriaStatusBannerProps) {
  const isOpen = useCafeteriaStatus((state) => state.isOpen);
  const opensAt = useCafeteriaStatus((state) => state.opensAt);
  const closesAt = useCafeteriaStatus((state) => state.closesAt);

  return (
    <View
      accessibilityLabel={isOpen ? "Cafetería abierta" : "Cafetería cerrada"}
      style={[
        styles.banner,
        contained && styles.contained,
        isOpen ? styles.bannerOpen : styles.bannerClosed,
      ]}
    >
      <View style={[styles.halo, isOpen ? styles.haloOpen : styles.haloClosed]}>
        <View style={[styles.core, isOpen ? styles.coreOpen : styles.coreClosed]} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{isOpen ? "Abierta" : "Cerrada"}</Text>
        <Text style={styles.hours}>
          {isOpen
            ? `Horario de hoy: ${opensAt} a ${closesAt}`
            : `Vuelve entre ${opensAt} y ${closesAt}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    borderRadius: radii.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bannerOpen: {
    backgroundColor: "#F3FBF6",
    borderColor: "#CFE8D8",
  },
  bannerClosed: {
    backgroundColor: "#FFF6F5",
    borderColor: "#F3D0CD",
  },
  contained: {
    marginHorizontal: 0,
  },
  halo: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  haloOpen: {
    backgroundColor: "#E5F8EC",
  },
  haloClosed: {
    backgroundColor: "#FDECEC",
  },
  core: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  coreOpen: {
    backgroundColor: colors.success,
  },
  coreClosed: {
    backgroundColor: colors.danger,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  hours: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});
