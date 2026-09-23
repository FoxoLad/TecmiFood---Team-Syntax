/** Productos de una categoría del menú, con búsqueda local. */
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import SafeView from "../../../components/SafeView";
import { ProductImage } from "../../../components/ProductImage";
import { colors, radii } from "../../../constants/theme";
import { useProductStore } from "../../../stores/useProduct";
import { isProductAvailable } from "../../../types/product";

const categorySources: Record<string, string[]> = {
    Frío: ["Bebidas"],
    Frappe: ["Frappe"],
    Caliente: ["Bebidas Calientes o Heladas"],
    Alimentos: ["Alimentos"],
    Otros: ["Stickers y Pines", "Extras y Desechables"],
};

export default function CategoryScreen() {
    const { category } = useLocalSearchParams<{ category?: string | string[] }>();
    const [search, setSearch] = useState("");
    const categoryName = Array.isArray(category) ? category[0] : category;
    const catalog = useProductStore((state) => state.products);
    const fetchProducts = useProductStore((state) => state.fetchProducts);

    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [fetchProducts]),
    );

    const products = useMemo(() => {
        const query = search.trim().toLowerCase();
        const sourceCategories = categorySources[categoryName ?? ""] ?? [];

        return catalog.filter((product) => {
            const matchesNamedCategory =
                sourceCategories.includes(product.category) || product.category === categoryName;

            return (
                product.businessId === "BT" &&
                isProductAvailable(product) &&
                matchesNamedCategory &&
                (!query || product.name.toLowerCase().includes(query))
            );
        });
    }, [catalog, categoryName, search]);

    return (
        <SafeView style={styles.container}>
            <View style={styles.topBar}>
                <Pressable
                    accessibilityLabel="Volver al menú de la cafetería"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={26} color={colors.text} />
                </Pressable>
                <Text style={styles.title}>{categoryName ?? "Productos"}</Text>
                <View style={styles.backButton} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color="#333333" />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={`Buscar en ${categoryName ?? "productos"}`}
                    placeholderTextColor="#777777"
                    style={styles.searchInput}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.productsGrid}
                showsVerticalScrollIndicator={false}
            >
                {products.map((product) => (
                    <Pressable
                        key={product.id}
                        onPress={() =>
                            router.push({
                                pathname: "/client/cafeterias/product/[id]",
                                params: { id: product.id },
                            })
                        }
                        style={styles.productCard}
                    >
                        <ProductImage
                            contentFit="contain"
                            image={product.image}
                            name={product.name}
                            style={styles.productImageBox}
                        />

                        <Text numberOfLines={2} style={styles.productName}>
                            {product.name}
                        </Text>
                        <Text style={styles.productPrice}>
                            ${product.price.toFixed(2)}
                        </Text>
                    </Pressable>
                ))}

                {products.length === 0 && (
                    <Text style={styles.emptyText}>
                        No se encontraron productos.
                    </Text>
                )}
            </ScrollView>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        padding: 16,
    },
    topBar: {
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 16,
    },
    backButton: {
        alignItems: "center",
        height: 44,
        justifyContent: "center",
        width: 44,
    },
    title: {
        color: colors.text,
        flex: 1,
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
    },
    searchContainer: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radii.pill,
        borderWidth: 1,
        flexDirection: "row",
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 8,
        paddingVertical: 10,
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "space-between",
        paddingBottom: 24,
    },
    productCard: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 10,
        width: "30%",
        shadowColor: "#302512",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    productImageBox: {
        backgroundColor: "#F8F3E8",
        borderRadius: 16,
        height: 100,
        marginBottom: 8,
        width: "100%",
    },
    productName: {
        color: colors.text,
        fontSize: 16,
        textAlign: "center",
    },
    productPrice: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
        textAlign: "center",
    },
    emptyText: {
        color: "#555555",
        fontSize: 18,
        textAlign: "center",
        width: "100%",
    },
});
