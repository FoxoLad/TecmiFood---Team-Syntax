import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import SafeView from "../../../components/SafeView";
import { getProductImageSource } from "../../../constants/images";
import { colors, radii, spacing } from "../../../constants/theme";
import { useFavoritesStore } from "../../../stores/useFavorites";

export default function FavoritesScreen() {
  const favorites = useFavoritesStore((state) => state.items);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TU COLECCION</Text>
          <Text style={styles.title}>Mis favoritos</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="heart" size={24} color={colors.danger} />
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={42} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Aun no tienes favoritos</Text>
          <Text style={styles.emptyMessage}>
            Toca el corazon de un producto para guardarlo aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={favorites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Abrir favorito ${item.name}`}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/client/cafeterias/product/[id]",
                  params: { id: item.id },
                })
              }
              style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
            >
              <Image
                source={getProductImageSource(item.image)}
                style={styles.productImage}
                resizeMode="contain"
              />
              <View style={styles.productInfo}>
                <Text numberOfLines={2} style={styles.productName}>
                  {item.name}
                </Text>
                <Text numberOfLines={2} style={styles.description}>
                  {item.description || "Sin descripcion disponible."}
                </Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
              <Pressable
                accessibilityLabel={`Quitar ${item.name} de favoritos`}
                accessibilityRole="button"
                hitSlop={8}
                onPress={(event) => {
                  event.stopPropagation();
                  removeFavorite(item.id);
                }}
                style={styles.removeButton}
              >
                <Ionicons name="heart" size={22} color={colors.danger} />
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: 10,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 2,
  },
  headerIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  listContent: {
    gap: 12,
    padding: spacing.screen,
    paddingBottom: 28,
  },
  productCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.medium,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
  },
  productCardPressed: {
    opacity: 0.72,
  },
  productImage: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.small,
    height: 82,
    width: 82,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
  },
  productName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  price: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },
  removeButton: {
    alignItems: "center",
    backgroundColor: "#FFF1F0",
    borderRadius: radii.small,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 36,
  },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 86,
    justifyContent: "center",
    width: 86,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 18,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 280,
    textAlign: "center",
  },
});
