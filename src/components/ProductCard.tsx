import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useProductStore } from "../stores/useProduct";
import { Product } from "../types/product";
import { productsImages } from "./images";

type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    const orderNumber = (product as Product & { NoOrder?: number }).NoOrder ?? 0;
    const status = (product as Product & { status?: string }).status ?? "Sin estado";
    const deleteProduct = useProductStore((state) => state.deleteProduct);

    // Función para asignar color dinámico según el estado
    const getStatusColor = (currentStatus: string) => {
        const normalized = currentStatus.toLowerCase().trim();
        if (normalized === "entregado") {
            return "#15803d"; // Verde
        }
        if (normalized === "pendiente") {
            return "#d97706"; // Ámbar / Amarillo legible sobre fondo beige
        }
        return "#555555";     // Gris por defecto
    };

    return (
        <View style={style.card}>
            <Text style={style.noOrden}>No Orden {orderNumber}</Text>

            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/client/products/[NoOrder]" as any,
                        params: { NoOrder: String(orderNumber) },
                    } as any)
                }
            >
                <Image
                    source={productsImages[product.image as keyof typeof productsImages]}
                    style={style.image}
                />
            </Pressable>

            <Text style={style.name}>{product.name}</Text>
            <Text style={style.description}>{product.description}</Text>
            <Text style={style.category}>{product.category}</Text>
            <Text style={style.precio}>Precio: ${product.price.toFixed(2)}</Text>

            {/* Estado con color dinámico */}
            <Text style={style.statusLabel}>
                Estado:{" "}
                <Text style={[style.statusValue, { color: getStatusColor(status) }]}>
                    {status}
                </Text>
            </Text>

            <Pressable
                style={style.deleteButton}
                onPress={() => Alert.alert("¿Estás seguro?", "Esta acción no se puede deshacer.", [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Eliminar", style: "destructive", onPress: () => deleteProduct(product.id) }
                ])}
            >
                <SymbolView
                    name={{
                        android: 'delete',
                    }}
                    size={22}
                    tintColor="red"
                />
            </Pressable>
        </View>
    );
}

const style = StyleSheet.create({
    card: {
        backgroundColor: "#EDE6CE", // Fondo beige
        padding: 20,
        borderColor: "#111110",
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 15,          // Espaciado entre tarjetas
    },
    noOrden: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 8,
        resizeMode: "cover",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
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
    },
    precio: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        marginVertical: 4,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#111110",
        marginBottom: 8,
    },
    statusValue: {
        fontWeight: "bold",
    },
    deleteButton: {
        alignSelf: "flex-end",
        marginTop: 4,
    },
});
