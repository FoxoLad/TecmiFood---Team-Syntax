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
    TextInput,
    View,
} from "react-native";

import SafeView from "../../../../components/SafeView";
import { getProductImageSource } from "../../../../constants/images";
import { colors, radii } from "../../../../constants/theme";
import productsData from "../../../../data/products.json";
import { MAX_PRODUCT_QUANTITY, useCartStore } from "../../../../stores/useCart";
import { useFavoritesStore } from "../../../../stores/useFavorites";
import { Product } from "../../../../types/product";

const bustersProducts = productsData as Product[];

const getModificationOptions = (category: string) => {
    if (category === "Alimentos") {
        return ["Sin salsa", "Sin ingredientes picantes", "Extra servilletas"];
    }

    if (
        category === "Bebidas" ||
        category === "Frappe" ||
        category === "Bebidas Calientes o Heladas"
    ) {
        return ["Sin hielo", "Poco hielo", "Sin azúcar"];
    }

    return ["Sin bolsa", "Empaque separado", "Extra servilletas"];
};

export default function BustersProductScreen() {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const [modalType, setModalType] = useState<"confirm" | "success" | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedModifications, setSelectedModifications] = useState<string[]>([]);
    const [additionalNotes, setAdditionalNotes] = useState("");
    const addItem = useCartStore((state) => state.addItem);
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
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
    const isFavorite = useFavoritesStore((state) =>
        product ? state.items.some((item) => item.id === product.id) : false,
    );

    const orderProduct = () => {
        if (!product) {
            return;
        }

        setModalType("confirm");
    };

    const totalPrice = product ? product.price * quantity : 0;

    const confirmAddToCart = () => {
        if (!product) {
            return;
        }

        addItem({
            product,
            quantity,
            modifications: selectedModifications,
            notes: additionalNotes.trim(),
        });
        setModalType("success");
    };

    const toggleModification = (modification: string) => {
        setSelectedModifications((current) =>
            current.includes(modification)
                ? current.filter((item) => item !== modification)
                : [...current, modification],
        );
    };

    if (!product) {
        return (
            <SafeView style={styles.container}>
                <Pressable
                    accessibilityLabel="Volver al menú de la cafetería"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.iconButton}
                >
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </Pressable>
                <Text style={styles.emptyText}>Producto no encontrado.</Text>
            </SafeView>
        );
    }

    return (
        <SafeView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    accessibilityLabel="Volver al menú de la cafetería"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.iconButton}
                >
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </Pressable>

                <View style={styles.headerActions}>
                    <Pressable
                        accessibilityLabel="Ir al carrito"
                        accessibilityRole="button"
                        onPress={() => router.push("/client/(client-tabs)/cart")}
                        style={styles.iconButton}
                    >
                        <Ionicons name="cart-outline" size={25} color={colors.text} />
                    </Pressable>
                    <Pressable
                        accessibilityLabel={isFavorite ? "Quitar de favoritos" : "Guardar como favorito"}
                        accessibilityRole="button"
                        onPress={() => product && toggleFavorite(product)}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={26}
                            color={isFavorite ? colors.danger : colors.text}
                        />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageBox}>
                    <Image
                        source={getProductImageSource(product.image)}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.description}>
                    {product.description || "Sin descripción disponible."}
                </Text>

                <Text style={styles.price}>${product.price.toFixed(2)}</Text>

                <Text style={styles.modificationsTitle}>Personaliza tu producto</Text>
                <Text style={styles.modificationsHint}>
                    Selecciona las modificaciones que necesites.
                </Text>

                <View style={styles.modificationsList}>
                    {getModificationOptions(product.category).map((modification) => {
                        const isSelected = selectedModifications.includes(modification);

                        return (
                            <Pressable
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: isSelected }}
                                key={modification}
                                onPress={() => toggleModification(modification)}
                                style={styles.modificationOption}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        isSelected && styles.checkboxSelected,
                                    ]}
                                >
                                    {isSelected ? (
                                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                    ) : null}
                                </View>
                                <Text style={styles.modificationText}>{modification}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                <TextInput
                    accessibilityLabel="Instrucciones adicionales"
                    multiline
                    onChangeText={setAdditionalNotes}
                    placeholder="¿Quieres agregar alguna indicación?"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.notesInput}
                    textAlignVertical="top"
                    value={additionalNotes}
                />

                <View style={styles.orderRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Agregar ${product.name} al carrito`}
                        onPress={orderProduct}
                        style={styles.orderButton}
                    >
                        <Text style={styles.orderButtonText}>AGREGAR AL CARRITO</Text>
                    </Pressable>

                    <View style={styles.quantityControl}>
                        <Pressable
                            accessibilityLabel="Disminuir cantidad"
                            accessibilityRole="button"
                            disabled={quantity === 1}
                            onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                            style={styles.quantityButton}
                        >
                            <Ionicons
                                color={quantity === 1 ? colors.textSecondary : colors.text}
                                name="remove"
                                size={18}
                            />
                        </Pressable>
                        <Text accessibilityLabel={`Cantidad: ${quantity}`} style={styles.quantityText}>
                            {quantity}
                        </Text>
                        <Pressable
                            accessibilityLabel="Aumentar cantidad"
                            accessibilityRole="button"
                            disabled={quantity >= MAX_PRODUCT_QUANTITY}
                            onPress={() =>
                                setQuantity((current) =>
                                    Math.min(MAX_PRODUCT_QUANTITY, current + 1),
                                )
                            }
                            style={styles.quantityButton}
                        >
                            <Ionicons
                                color={quantity >= MAX_PRODUCT_QUANTITY ? colors.textSecondary : colors.text}
                                name="add"
                                size={18}
                            />
                        </Pressable>
                    </View>
                </View>
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
                                ? `¿Deseas agregar ${quantity} ${quantity === 1 ? "unidad" : "unidades"} de ${product.name}?`
                                : `${product.name} se agregó al carrito.`}
                        </Text>
                        {modalType === "confirm" ? (
                            <Text style={styles.modalTotal}>
                                Total a pagar: ${totalPrice.toFixed(2)}
                            </Text>
                        ) : null}
                        {modalType === "confirm" &&
                        (selectedModifications.length > 0 || additionalNotes.trim()) ? (
                            <Text style={styles.modalDetails}>
                                {selectedModifications.length > 0
                                    ? `Modificaciones: ${selectedModifications.join(", ")}. `
                                    : ""}
                                {additionalNotes.trim()
                                    ? `Nota: ${additionalNotes.trim()}`
                                    : ""}
                            </Text>
                        ) : null}

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
                                    onPress={confirmAddToCart}
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
    header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        minHeight: 44,
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        alignItems: "center",
        height: 44,
        justifyContent: "center",
        width: 44,
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
    modificationsTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 24,
    },
    modificationsHint: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    modificationsList: {
        gap: 10,
        marginTop: 14,
    },
    modificationOption: {
        alignItems: "center",
        flexDirection: "row",
        minHeight: 34,
    },
    checkbox: {
        alignItems: "center",
        borderColor: colors.border,
        borderRadius: 5,
        borderWidth: 1.5,
        height: 23,
        justifyContent: "center",
        marginRight: 10,
        width: 23,
    },
    checkboxSelected: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    modificationText: {
        color: colors.text,
        fontSize: 16,
    },
    notesInput: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radii.small,
        borderWidth: 1,
        fontSize: 15,
        height: 90,
        marginTop: 16,
        padding: 12,
    },
    orderRow: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    orderButton: {
        alignItems: "center",
        backgroundColor: colors.accent,
        borderRadius: radii.pill,
        flex: 1,
        paddingVertical: 15,
    },
    orderButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "bold",
    },
    quantityControl: {
        alignItems: "center",
        borderColor: colors.border,
        borderRadius: radii.pill,
        borderWidth: 1,
        flexDirection: "row",
        height: 50,
    },
    quantityButton: {
        alignItems: "center",
        height: 48,
        justifyContent: "center",
        width: 38,
    },
    quantityText: {
        color: colors.text,
        fontSize: 17,
        fontWeight: "bold",
        minWidth: 20,
        textAlign: "center",
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
    modalTotal: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
        textAlign: "center",
    },
    modalDetails: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
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
