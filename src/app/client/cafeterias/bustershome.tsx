import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import SafeView from "../../../components/SafeView";
import { ProductImage } from "../../../components/ProductImage";
import { colors, radii } from "../../../constants/theme";
import productsData from "../../../data/products.json";
import { Product } from "../../../types/product";

const bustersProducts = productsData as Product[];
type QuickFilter = "Todos" | "Alimentos" | "Bebidas" | "Otros";

export default function HomeScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const cafeteriaName = name || "Busters";
    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<QuickFilter>("Todos");
    const { width: screenWidth } = useWindowDimensions();
    const productPageWidth = screenWidth - 64;

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return bustersProducts.filter(
            (product) =>
                product.businessId === "BT" &&
                (!query || product.name.toLowerCase().includes(query))
        );
    }, [search]);

    const alimentos = filteredProducts.filter(p => p.category === "Comidas");
    const bebidas = filteredProducts.filter(p => p.category === "Bebidas");
    const otros = filteredProducts.filter(p => p.category === "Otros" || p.category === "Extras y Desechables");

    const splitIntoGroups = (products: Product[], groupSize: number) => {
        const groups: Product[][] = [];
        for (let index = 0; index < products.length; index += groupSize) {
            groups.push(products.slice(index, index + groupSize));
        }
        return groups;
    };

    const renderDirectGrid = (products: Product[]) => {
        if (products.length === 0) return null;
        return (
            <View style={styles.gridContainer}>
                {products.map(product => (
                    <View key={product.id} style={styles.gridItem}>
                        <ProductImage
                            contentFit="contain"
                            image={product.image}
                            name={product.name}
                            style={styles.gridImage}
                        />
                        <Text numberOfLines={2} style={styles.gridName}>{product.name}</Text>
                        <Text style={styles.gridPrice}>${product.price.toFixed(2)}</Text>
                        <Pressable 
                            style={styles.addButton}
                            onPress={() => router.push({
                                pathname: "/client/cafeterias/product/[id]",
                                params: { id: product.id },
                            })}
                        >
                            <Text style={styles.addButtonText}>Agregar al carrito</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
        );
    };

    const renderBebidasCategories = () => {
        if (bebidas.length === 0) return null;
        // Agrupar por subcategoria
        const subcategories = Array.from(new Set(bebidas.map(p => p.subcategory || "Otros")));
        
        return (
            <View>
                {subcategories.map(sub => {
                    const subProducts = bebidas.filter(p => (p.subcategory || "Otros") === sub);
                    if (subProducts.length === 0) return null;
                    return (
                        <View key={sub} style={styles.categoryCard}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.categoryTitle}>{sub}</Text>
                            </View>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled
                            >
                                {splitIntoGroups(subProducts, 3).map((productGroup, groupIndex) => (
                                    <View
                                        key={`${sub}-${groupIndex}`}
                                        style={[styles.productsPage, { width: productPageWidth }]}
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
                                                    style={styles.productCardBox}
                                                >
                                                    <ProductImage
                                                        contentFit="contain"
                                                        image={product.image}
                                                        name={product.name}
                                                        style={styles.productImageBox}
                                                    />
                                                    <Text numberOfLines={2} style={styles.productNameBox}>
                                                        {product.name}
                                                    </Text>
                                                    <Text style={styles.productPriceBox}>
                                                        ${product.price.toFixed(2)}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    );
                })}
            </View>
        );
    };

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

            <Text style={styles.title}>{cafeteriaName}</Text>

            <View style={styles.buttonRow}>
                <Pressable
                    onPress={() => setSelectedFilter("Alimentos")}
                    style={[styles.menuButton, selectedFilter === "Alimentos" && styles.menuButtonActive]}
                >
                    <Text style={[styles.menuButtonText, selectedFilter === "Alimentos" && styles.menuButtonTextActive]}>
                        ALIMENTOS
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setSelectedFilter("Bebidas")}
                    style={[styles.menuButton, selectedFilter === "Bebidas" && styles.menuButtonActive]}
                >
                    <Text style={[styles.menuButtonText, selectedFilter === "Bebidas" && styles.menuButtonTextActive]}>
                        BEBIDAS
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setSelectedFilter("Otros")}
                    style={[styles.menuButton, selectedFilter === "Otros" && styles.menuButtonActive]}
                >
                    <Text style={[styles.menuButtonText, selectedFilter === "Otros" && styles.menuButtonTextActive]}>
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuContainer}>
                {(selectedFilter === "Todos" || selectedFilter === "Alimentos") && renderDirectGrid(alimentos)}
                {(selectedFilter === "Todos" || selectedFilter === "Bebidas") && renderBebidasCategories()}
                {(selectedFilter === "Todos" || selectedFilter === "Otros") && renderDirectGrid(otros)}
                
                {filteredProducts.length === 0 && (
                    <Text style={styles.emptyText}>No se encontraron productos.</Text>
                )}
            </ScrollView>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 16 },
    backButton: { left: 16, position: "absolute", top: 58, zIndex: 1 },
    title: { borderBottomColor: "rgba(0, 0, 0, 0.65)", borderBottomWidth: 1, color: "#000000", fontSize: 36, fontWeight: "bold", marginBottom: 20, paddingBottom: 8, textAlign: "center" },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    menuButton: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, flex: 1, marginHorizontal: 4, paddingVertical: 12 },
    menuButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    menuButtonText: { color: colors.text, fontSize: 14, fontWeight: "bold" },
    menuButtonTextActive: { color: colors.surface },
    searchContainer: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, flexDirection: "row", marginBottom: 20, paddingHorizontal: 12 },
    searchInput: { flex: 1, fontSize: 16, paddingLeft: 8, paddingVertical: 10 },
    searchEmoji: { fontSize: 24, marginLeft: 8 },
    menuContainer: { paddingBottom: 24 },
    
    // Grid Styles
    gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 4, marginBottom: 20 },
    gridItem: { width: "48%", backgroundColor: colors.surface, borderRadius: radii.large, padding: 12, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    gridImage: { height: 120, width: "100%", borderRadius: radii.medium, marginBottom: 12 },
    gridName: { fontSize: 16, fontWeight: "700", color: colors.text, textAlign: "center", minHeight: 40 },
    gridPrice: { fontSize: 16, color: colors.accent, fontWeight: "bold", textAlign: "center", marginVertical: 8 },
    addButton: { backgroundColor: colors.accent, paddingVertical: 8, borderRadius: radii.pill, alignItems: "center", marginTop: 'auto' },
    addButtonText: { color: colors.surface, fontWeight: "bold", fontSize: 13 },
    
    // Box/Category Styles (for Bebidas)
    categoryCard: { backgroundColor: colors.accent, borderRadius: radii.large, marginBottom: 20, padding: 16, shadowColor: "#5C3D0E", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 5 },
    categoryHeader: { alignItems: "center", flexDirection: "row", marginBottom: 12 },
    categoryTitle: { color: colors.surface, fontSize: 22, fontWeight: "bold", marginRight: 10 },
    productsRow: { flexDirection: "row", justifyContent: "space-between" },
    productsPage: { flex: 1 },
    productCardBox: { alignItems: "center", width: "31%" },
    productImageBox: { backgroundColor: "#FFFFFF", borderRadius: 16, height: 100, marginBottom: 8, width: 100 },
    productNameBox: { color: colors.surface, fontSize: 16, textAlign: "center" },
    productPriceBox: { color: colors.surface, fontSize: 16, fontWeight: "bold", marginTop: 4, textAlign: "center" },
    
    emptyText: { color: "#555555", fontSize: 18, textAlign: "center" },
});
