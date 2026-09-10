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

type Product = {
    name: string;
    image: string;
};

type Category = {
    name: string;
    products: Product[];
};

const categories: Category[] = [
    {
        name: "Frío",
        products: [
            {
                name: "Croissant",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
            },
            {
                name: "Chocolatín",
                image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=500",
            },
            {
                name: "Panqué",
                image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500",
            },
        ],
    },
    {
        name: "Frappe",
        products: [
            {
                name: "Croissant",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
            },
            {
                name: "Chocolatín",
                image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=500",
            },
            {
                name: "Panqué",
                image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500",
            },
        ],
    },
    {
        name: "Caliente",
        products: [
            {
                name: "Croissant",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
            },
            {
                name: "Chocolatín",
                image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=500",
            },
            {
                name: "Panqué",
                image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500",
            },
        ],
    },
    {
        name: "Otros",
        products: [
            {
                name: "Croissant",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
            },
            {
                name: "Chocolatín",
                image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=500",
            },
            {
                name: "Panqué",
                image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500",
            },
        ],
    },
];

export default function HomeScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const [search, setSearch] = useState("");

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return categories;
        }

        return categories
            .map((category) => ({
                ...category,
                products: category.products.filter((product) =>
                    product.name.toLowerCase().includes(query)
                ),
            }))
            .filter((category) => category.products.length > 0);
    }, [search]);

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
                <Pressable style={styles.menuButton}>
                    <Text style={styles.menuButtonText}>ALIMENTOS</Text>
                </Pressable>

                <Pressable style={styles.menuButton}>
                    <Text style={styles.menuButtonText}>BEBIDAS</Text>
                </Pressable>

                <Pressable style={styles.menuButton}>
                    <Text style={styles.menuButtonText}>OTROS</Text>
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
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.menuContainer}
            >
                {filteredCategories.map((category) => (
                    <View key={category.name} style={styles.categoryCard}>
                        <View style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>
                                {category.name}
                            </Text>

                            <Pressable
                                accessibilityRole="button"
                                style={styles.arrowButton}
                            >
                                <Ionicons
                                    name="chevron-forward"
                                    size={22}
                                    color="#000000"
                                />
                            </Pressable>
                        </View>

                        <View style={styles.productsRow}>
                            {category.products.map((product) => (
                                <Pressable
                                    key={product.name}
                                    style={styles.productCard}
                                >
                                    <Image
                                        source={{ uri: product.image }}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                    />

                                    <Text style={styles.productName}>
                                        {product.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
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
        backgroundColor: "#CBC583",
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
    },
    menuButtonText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "bold",
    },
    searchContainer: {
        alignItems: "center",
        borderColor: "#000000",
        borderRadius: 8,
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
    menuContainer: {
        paddingBottom: 24,
    },
    categoryCard: {
        backgroundColor: "#E3A00B",
        borderRadius: 28,
        marginBottom: 20,
        padding: 16,
    },
    categoryHeader: {
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 12,
    },
    categoryTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
        marginRight: 10,
    },
    arrowButton: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        height: 30,
        justifyContent: "center",
        width: 30,
    },
    productsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    productCard: {
        alignItems: "center",
        flex: 1,
    },
    productImage: {
        height: 90,
        marginBottom: 8,
        width: 100,
    },
    productName: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: "center",
    },
    emptyText: {
        color: "#555555",
        fontSize: 18,
        textAlign: "center",
    },
});