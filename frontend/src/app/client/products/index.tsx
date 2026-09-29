/** Catálogo general. Sustituye la vista de prueba y abre el detalle de cada producto. */
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SafeView from "../../../components/SafeView";
import { ProductImage } from "../../../components/ProductImage";
import { radii, shadows, spacing, type Palette } from "../../../constants/theme";
import { useColors } from "../../../stores/useTheme";
import { useProductStore } from "../../../stores/useProduct";
import { isProductAvailable } from "../../../types/product";

export default function ProductsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts]),
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter(
      (product) =>
        isProductAvailable(product) &&
        (!query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)),
    );
  }, [products, search]);

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons color={colors.text} name="chevron-back" size={24} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>MENÚ</Text>
          <Text style={styles.title}>Productos</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons color={colors.textSecondary} name="search-outline" size={20} />
        <TextInput
          onChangeText={setSearch}
          placeholder="Buscar producto o categoría"
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={search}
        />
      </View>

      {isLoading && products.length === 0 ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.emptyMessage}>Cargando menú...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={visibleProducts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyMessage}>Prueba con otro nombre o categoría.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Ver ${item.name}`}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/client/cafeterias/product/[id]",
                  params: { id: item.id },
                })
              }
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <ProductImage
                contentFit="cover"
                image={item.image}
                name={item.name}
                style={styles.image}
              />
              <View style={styles.cardCopy}>
                <Text numberOfLines={2} style={styles.name}>
                  {item.name}
                </Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerCopy: {
    flex: 1,
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
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: spacing.screen,
    marginTop: 16,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  listContent: {
    gap: 12,
    padding: spacing.screen,
    paddingBottom: 28,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#E7E2D8",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.78,
  },
  image: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.small,
    height: 76,
    width: 76,
  },
  cardCopy: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  category: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
  },
  price: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  });
}
