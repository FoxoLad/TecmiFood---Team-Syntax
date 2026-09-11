import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import SafeView from "../../../../components/SafeView";
import { colors, radii } from "../../../../constants/theme";
import productsData from "../../../../data/products.json";
import { Product } from "../../../../types/product";

const bustersProducts = productsData as Product[];

export default function BustersProductScreen() {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const [modalType, setModalType] = useState<"confirm" | "success" | null>(null);
    const productId = Array.isArray(id) ? id[0] : id;
    const product = useMemo(
        () =>
            bustersProducts.find(
                (currentProduct) =>
                    currentProduct.id === productId &&
                    currentProduct.businessId === "BT",
            ),
        [productId],
    );

    const orderProduct = () => {
        if (!product) {
            return;
        }

        setModalType("confirm");
    };

    if (!product) {
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
                <Text style={styles.title}>Producto</Text>
                <Text style={styles.emptyText}>Producto no encontrado.</Text>
            </SafeView>
        );
    }

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

            <Text numberOfLines={2} style={styles.title}>
                {product.name}
            </Text>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageBox}>
                    {product.image.startsWith("http") ? (
                        <Image
                            source={{ uri: product.image }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : null}
                </View>

                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.description}>
                    {product.description || "Sin descripción disponible."}
                </Text>

                <Text style={styles.price}>${product.price.toFixed(2)}</Text>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Agregar ${product.name} al carrito`}
                    onPress={orderProduct}
                    style={styles.orderButton}
                >
                    <Text style={styles.orderButtonText}>AGREGAR AL CARRITO</Text>
                </Pressable>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent
                visible={modalType !== null}
                onRequestClose={() => setModalType(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {modalType === "success" ? (
                            <Ionicons
                                color={colors.success}
                                name="checkmark-circle"
                                size={64}
                                style={styles.successIcon}
                            />
                        ) : null}
                        <Text style={styles.modalTitle}>
                            {modalType === "confirm"
                                ? "Agregar al carrito"
                                : "Producto agregado"}
                        </Text>
                        <Text style={styles.modalMessage}>
                            {modalType === "confirm"
                                ? `¿Deseas agregar ${product.name} al carrito por $${product.price.toFixed(2)}?`
                                : `${product.name} se agregó al carrito.`}
                        </Text>

                        {modalType === "confirm" ? (
                            <View style={styles.modalActions}>
                                <Pressable
                                    onPress={() => setModalType(null)}
                                    style={styles.cancelButton}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        CANCELAR
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setModalType("success")}
                                    style={styles.confirmButton}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        CONFIRMAR
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={() => setModalType(null)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>ACEPTAR</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </Modal>
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
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        paddingBottom: 8,
        textAlign: "center",
    },
    content: {
        paddingBottom: 24,
    },
    imageBox: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        height: 220,
        justifyContent: "center",
        marginBottom: 20,
        width: "100%",
    },
    image: {
        height: "100%",
        width: "100%",
    },
    name: {
        color: colors.text,
        fontSize: 26,
        fontWeight: "bold",
    },
    category: {
        color: colors.accent,
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 6,
        textTransform: "uppercase",
    },
    description: {
        color: "#444444",
        fontSize: 17,
        lineHeight: 24,
        marginTop: 16,
    },
    price: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 20,
    },
    orderButton: {
        alignItems: "center",
        backgroundColor: colors.accent,
        borderRadius: radii.pill,
        marginTop: 24,
        paddingVertical: 15,
    },
    orderButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "bold",
    },
    modalOverlay: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        width: "100%",
    },
    modalTitle: {
        color: "#000000",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    successIcon: {
        alignSelf: "center",
        marginBottom: 8,
    },
    modalMessage: {
        color: "#444444",
        fontSize: 16,
        lineHeight: 22,
        marginTop: 12,
        textAlign: "center",
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        alignItems: "center",
        backgroundColor: "#E5E5E5",
        borderRadius: 14,
        flex: 1,
        paddingVertical: 13,
    },
    cancelButtonText: {
        color: "#333333",
        fontSize: 14,
        fontWeight: "bold",
    },
    confirmButton: {
        alignItems: "center",
        backgroundColor: "#8F651A",
        borderRadius: 14,
        flex: 1,
        paddingVertical: 13,
    },
    confirmButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    closeButton: {
        alignItems: "center",
        backgroundColor: colors.surfaceMuted,
        borderRadius: radii.pill,
        marginTop: 24,
        paddingVertical: 13,
    },
    closeButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "bold",
    },
    emptyText: {
        color: "#555555",
        fontSize: 18,
        marginTop: 40,
        textAlign: "center",
    },
});
