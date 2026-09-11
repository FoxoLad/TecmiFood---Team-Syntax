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
    useWindowDimensions,
    View,
} from "react-native";

import SafeView from "../../../components/SafeView";
import { colors, radii } from "../../../constants/theme";
import productsData from "../../../data/products.json";
import { Product } from "../../../types/product";

const categoryDefinitions = [
    {
        name: "Frío",
        sourceCategories: ["Bebidas"],
    },
    {
        name: "Frappe",
        sourceCategories: ["Frappe"],
    },
    {
        name: "Caliente",
        sourceCategories: ["Bebidas Calientes o Heladas"],
    },
    {
        name: "Alimentos",
        sourceCategories: ["Alimentos"],
    },
    {
        name: "Otros",
        sourceCategories: ["Stickers y Pines", "Extras y Desechables"],
    },
];

const bustersProducts = productsData as Product[];
type QuickFilter = "Todos" | "Alimentos" | "Bebidas" | "Otros";

const quickFilterCategories: Record<Exclude<QuickFilter, "Todos">, string[]> = {
    Alimentos: ["Alimentos"],
    Bebidas: ["Frío", "Frappe", "Caliente"],
    Otros: ["Otros"],
};

const splitIntoGroups = (products: Product[], groupSize: number) => {
    const groups: Product[][] = [];

    for (let index = 0; index < products.length; index += groupSize) {
        groups.push(products.slice(index, index + groupSize));
    }

    return groups;
};

export default function HomeScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<QuickFilter>("Todos");
    const { width: screenWidth } = useWindowDimensions();
    const productPageWidth = screenWidth - 64;

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();

        return categoryDefinitions
            .map((category) => ({
                name: category.name,
                products: bustersProducts.filter(
                    (product) =>
                        product.businessId === "BT" &&
                        category.sourceCategories.includes(product.category) &&
                        (!query || product.name.toLowerCase().includes(query)),
                ),
            }))
            .filter(
                (category) =>
                    selectedFilter === "Todos" ||
                    quickFilterCategories[selectedFilter].includes(category.name),
            )
            .filter((category) => category.products.length > 0);
    }, [search, selectedFilter]);

    return (
        <SafeView style={styles.container}>
            <Pressable
                accessibilityLabel="Volver a cafeterías"
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={32} color="#000000" />
            </Pressable>

            <Text style={styles.title}>{name}</Text>

            <View style={styles.buttonRow}>
                <Pressable
                    onPress={() => setSelectedFilter("Alimentos")}
                    style={[
                        styles.menuButton,
                        selectedFilter === "Alimentos" && styles.menuButtonActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.menuButtonText,
                            selectedFilter === "Alimentos" && styles.menuButtonTextActive,
                        ]}
                    >
                        ALIMENTOS
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setSelectedFilter("Bebidas")}
                    style={[
                        styles.menuButton,
                        selectedFilter === "Bebidas" && styles.menuButtonActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.menuButtonText,
                            selectedFilter === "Bebidas" && styles.menuButtonTextActive,
                        ]}
                    >
                        BEBIDAS
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setSelectedFilter("Otros")}
                    style={[
                        styles.menuButton,
                        selectedFilter === "Otros" && styles.menuButtonActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.menuButtonText,
                            selectedFilter === "Otros" && styles.menuButtonTextActive,
                        ]}
                    >
                        OTROS
                    </Text>
                </Pressable>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color="#333333" />

                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar en el menú"
                    placeholderTextColor="#777777"
                    style={styles.searchInput}
                />

                <Text accessibilityLabel="Perrito" style={styles.searchEmoji}>
                    🐶🐶🐶
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.menuContainer}
            >
                {filteredCategories.map((category) => (
                    <View key={category.name} style={styles.categoryCard}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Ver todos los productos de ${category.name}`}
                            onPress={() =>
                                router.push({
                                    pathname: "/client/cafeterias/[category]",
                                    params: { category: category.name },
                                })
                            }
                            style={styles.categoryHeader}
                        >
                            <Text style={styles.categoryTitle}>
                                {category.name}
                            </Text>

                            <View style={styles.arrowButton}>
                                <Ionicons
                                    name="chevron-forward"
                                    size={22}
                                    color="#000000"
                                />
                            </View>
                        </Pressable>

                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled
                        >
                            {splitIntoGroups(category.products, 3).map(
                                (productGroup, groupIndex) => (
                                    <View
                                        key={`${category.name}-${groupIndex}`}
                                        style={[
                                            styles.productsPage,
                                            { width: productPageWidth },
                                        ]}
                                    >
                                        <View style={styles.productsRow}>
                                            {productGroup.map((product) => (
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
                                                    <View
                                                        style={
                                                            styles.productImageBox
                                                        }
                                                    >
                                                        {product.image ? (
                                                            <Image
                                                                source={{
                                                                    uri: product.image,
                                                                }}
                                                                style={
                                                                    styles.productImage
                                                                }
                                                                resizeMode="contain"
                                                            />
                                                        ) : null}
                                                    </View>

                                                    <Text
                                                        numberOfLines={2}
                                                        style={styles.productName}
                                                    >
                                                        {product.name}
                                                    </Text>

                                                    <Text
                                                        style={styles.productPrice}
                                                    >
                                                        ${product.price.toFixed(2)}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>
                                ),
                            )}
                        </ScrollView>
                    </View>
                ))}

                {filteredCategories.length === 0 && (
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
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
    },
    backButton: {
        left: 16,
        position: "absolute",
        top: 58,
        zIndex: 1,
    },
    title: {
        borderBottomColor: "rgba(0, 0, 0, 0.65)",
        borderBottomWidth: 1,
        color: "#000000",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
        paddingBottom: 8,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    menuButton: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radii.pill,
        borderWidth: 1,
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
    },
    menuButtonActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    menuButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "bold",
    },
    menuButtonTextActive: {
        color: colors.surface,
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
    searchEmoji: {
        fontSize: 24,
        marginLeft: 8,
    },
    menuContainer: {
        paddingBottom: 24,
    },
    categoryCard: {
        backgroundColor: colors.accent,
        borderRadius: radii.large,
        marginBottom: 20,
        padding: 16,
    },
    categoryHeader: {
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 12,
    },
    categoryTitle: {
        color: colors.surface,
        fontSize: 22,
        fontWeight: "bold",
        marginRight: 10,
    },
    arrowButton: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: radii.pill,
        height: 30,
        justifyContent: "center",
        width: 30,
    },
    productsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    productsPage: {
        flex: 1,
    },
    productCard: {
        alignItems: "center",
        backgroundColor: colors.accent,
        borderRadius: radii.small,
        width: "31%",
    },
    productImageBox: {
        alignItems: "center",
        backgroundColor: colors.surface,
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
        color: colors.surface,
        fontSize: 16,
        textAlign: "center",
    },
    productPrice: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
        textAlign: "center",
    },
    emptyText: {
        color: "#555555",
        fontSize: 18,
        textAlign: "center",
    },
});