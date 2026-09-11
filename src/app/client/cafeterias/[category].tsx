import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import SafeView from "../../../components/SafeView";
import { getProductImageSource } from "../../../constants/images";
import { colors, radii } from "../../../constants/theme";
import productsData from "../../../data/products.json";
import { Product } from "../../../types/product";

const categorySources: Record<string, string[]> = {
    Frío: ["Bebidas"],
    Frappe: ["Frappe"],
    Caliente: ["Bebidas Calientes o Heladas"],
    Alimentos: ["Alimentos"],
    Otros: ["Stickers y Pines", "Extras y Desechables"],
};

const bustersProducts = productsData as Product[];

export default function CategoryScreen() {
    const { category } = useLocalSearchParams<{ category?: string | string[] }>();
    const [search, setSearch] = useState("");
    const categoryName = Array.isArray(category) ? category[0] : category;

    const products = useMemo(() => {
        const query = search.trim().toLowerCase();
        const sourceCategories = categorySources[categoryName ?? ""] ?? [];

        return bustersProducts.filter(
            (product) =>
                product.businessId === "BT" &&
                sourceCategories.includes(product.category) &&
                (!query || product.name.toLowerCase().includes(query)),
        );
    }, [categoryName, search]);

    return (
        <SafeView style={styles.container}>
            <Pressable
                accessibilityLabel="Volver al menú de la cafetería"
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={32} color="#000000" />
            </Pressable>

            <Text style={styles.title}>{categoryName ?? "Productos"}</Text>

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
                        <View style={styles.productImageBox}>
                            <Image
                                source={getProductImageSource(product.image)}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        </View>

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
    backButton: {
        left: 16,
        position: "absolute",
        top: 58,
        zIndex: 1,
    },
    title: {
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        color: colors.text,
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
        paddingBottom: 8,
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
        width: "30%",
    },
    productImageBox: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        height: 100,
        justifyContent: "center",
        marginBottom: 8,
        width: 100,
    },
    productImage: {
        height: "100%",
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
