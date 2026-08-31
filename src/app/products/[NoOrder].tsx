import { useLocalSearchParams, useNavigation } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { productsImages } from "../../components/images";
import { useProductStore } from "../../stores/useProduct";

export default function ProductDetailsScreen() {
    const { NoOrder } = useLocalSearchParams();
    const product = useProductStore((state) =>
        state.products.find((p) => String(p.NoOrder) === NoOrder)
    );
    const navigation = useNavigation();

    const getStatusColor = (currentStatus?: string) => {
        const normalized = (currentStatus ?? "").toLowerCase().trim();
        if (normalized === "entregado") return "#15803d"; // Verde
        if (normalized === "pendiente") return "#d97706"; // Ámbar / Amarillo legible
        return "#555555";
    };

    if (!product) {
        return (
            <SafeAreaView style={style.container}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={style.backText}>← Volver</Text>
                </Pressable>
                <Text style={style.notFoundText}>Producto no encontrado</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={style.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Text style={style.backText}>← Volver</Text>
            </Pressable>

            <View style={style.card}>
                <Text style={style.noOrden}>No Orden {product.NoOrder}</Text>

                <Image
                    source={productsImages[product.image as keyof typeof productsImages]}
                    style={style.image}
                />

                <Text style={style.name}>{product.name}</Text>
                <Text style={style.description}>{product.description}</Text>
                <Text style={style.category}>{product.category}</Text>
                <Text style={style.precio}>Precio: ${product.price.toFixed(2)}</Text>

                <Text style={style.statusLabel}>
                    Estado:{" "}
                    <Text style={[style.statusValue, { color: getStatusColor(product.status) }]}>
                        {product.status ?? "Sin estado"}
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DFCDB2", // Fondo beige general
        padding: 16,
    },
    backText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#111110",
    },
    noOrden: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#111110",
    },
    card: {
        backgroundColor: "#EDE6CE",
        padding: 15,
        borderColor: "#111110",
        borderWidth: 2,
        borderRadius: 12,
    },
    image: {
        width: "100%",
        height: 220,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: "cover",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111110",
    },
    description: {
        fontSize: 14,
        color: "#555555",
        marginVertical: 4,
    },
    category: {
        fontSize: 12,
        color: "#888888",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    precio: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111110",
        marginVertical: 4,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#111110",
        marginTop: 4,
    },
    statusValue: {
        fontWeight: "bold",
    },
    notFoundText: {
        fontSize: 16,
        color: "#555555",
        textAlign: "center",
        marginTop: 20,
    },
});
