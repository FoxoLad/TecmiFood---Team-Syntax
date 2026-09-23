import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
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
import productsData from "../../../data/products.json";
import { Product } from "../../../types/product";

const bustersProducts = productsData as Product[];
type QuickFilter = "Comidas" | "Bebidas" | "Otros";

export default function HomeScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const cafeteriaName = name || "Busters";
    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<QuickFilter>("Comidas");

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return bustersProducts.filter(
            (product) =>
                product.businessId === "BT" &&
                (!query || product.name.toLowerCase().includes(query))
        );
    }, [search]);

    const comidas = filteredProducts.filter(p => p.category === "Comidas");
    const bebidas = filteredProducts.filter(p => p.category === "Bebidas");
    const otros = filteredProducts.filter(p => p.category === "Otros" || p.category === "Extras y Desechables");

    const renderDirectGrid = (products: Product[]) => {
        if (products.length === 0) return null;
        return (
            <View style={styles.gridContainer}>
                {products.map(product => (
                    <Pressable 
                        key={product.id}
                        style={styles.gridItem}
                        onPress={() => router.push({
                            pathname: "/client/cafeterias/product/[id]",
                            params: { id: product.id },
                        })}
                    >
                        <ProductImage
                            contentFit="contain"
                            image={product.image}
                            name={product.name}
                            style={styles.gridImage}
                        />
                        <View style={styles.gridContent}>
                            <Text numberOfLines={2} style={styles.gridName}>{product.name}</Text>
                            <Text style={styles.gridPrice}>${product.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.plusIcon}>
                            <Ionicons name="add" size={20} color={colors.text} />
                        </View>
                    </Pressable>
                ))}
            </View>
        );
    };

    const renderBebidasCategories = () => {
        if (bebidas.length === 0) return null;
        const subcategories = Array.from(new Set(bebidas.map(p => p.subcategory || "Otros")));
        
        return (
            <View>
                {subcategories.map(sub => {
                    const subProducts = bebidas.filter(p => (p.subcategory || "Otros") === sub);
                    if (subProducts.length === 0) return null;
                    return (
                        <View key={sub}>
                            <Text style={styles.subcategoryTitle}>{sub}</Text>
                            {renderDirectGrid(subProducts)}
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

            <View style={styles.buttonRow}>
                <Pressable
                    onPress={() => setSelectedFilter("Comidas")}
                    style={[styles.menuButton, selectedFilter === "Comidas" && styles.menuButtonActive]}
                >
                    <Text style={[styles.menuButtonText, selectedFilter === "Comidas" && styles.menuButtonTextActive]}>
                        COMIDAS
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuContainer}>
                {search.trim() !== "" ? (
                    renderDirectGrid(filteredProducts)
                ) : (
                    <>
                        {selectedFilter === "Comidas" && renderDirectGrid(comidas)}
                        {selectedFilter === "Bebidas" && renderBebidasCategories()}
                        {selectedFilter === "Otros" && renderDirectGrid(otros)}
                    </>
                )}
                
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
    
    searchContainer: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, flexDirection: "row", marginBottom: 20, paddingHorizontal: 12 },
    searchInput: { flex: 1, fontSize: 16, paddingLeft: 8, paddingVertical: 10 },
    searchEmoji: { fontSize: 24, marginLeft: 8 },

    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    menuButton: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, flex: 1, marginHorizontal: 4, paddingVertical: 12 },
    menuButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    menuButtonText: { color: colors.text, fontSize: 14, fontWeight: "bold" },
    menuButtonTextActive: { color: colors.surface },
    
    menuContainer: { paddingBottom: 24 },
    
    // Grid Styles (Uber Eats style)
    gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 4, marginBottom: 20 },
    gridItem: { 
        width: "48%", 
        backgroundColor: colors.surface, 
        borderRadius: radii.large, 
        padding: 12, 
        marginBottom: 16, 
        elevation: 3, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4,
        position: 'relative'
    },
    gridImage: { height: 120, width: "100%", borderRadius: radii.medium, marginBottom: 8 },
    gridContent: { flex: 1, justifyContent: "space-between" },
    gridName: { fontSize: 15, fontWeight: "600", color: colors.text, marginBottom: 4 },
    gridPrice: { fontSize: 14, color: colors.textSecondary },
    plusIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: colors.background,
        borderRadius: radii.pill,
        padding: 4,
        elevation: 2,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 2,
    },
    
    // Subcategories Text
    subcategoryTitle: { fontSize: 22, fontWeight: "bold", color: colors.text, marginVertical: 16, marginLeft: 4 },
    
    emptyText: { color: "#555555", fontSize: 18, textAlign: "center", marginTop: 20 },
});
